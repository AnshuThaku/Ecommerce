const User           = require('../../models/User/userModel');
const CompanyProfile = require('../../models/company/companyModel');
const bcrypt         = require('bcryptjs');
const generatePassword = require('../../utils/generatePassword');
const emailService   = require('../../services/emailService/emailService');
const wrapAsync      = require('../../utils/errorHandler/wrapAsync');
const ExpressError   = require('../../utils/errorHandler/expressError');

// ─────────────────────────────────────────────────────────
//  ADMIN MANAGEMENT
// ─────────────────────────────────────────────────────────

/**
 * POST /api/admin/create-admin
 * Super-Admin creates a new admin account and emails credentials
 */
exports.createAdmin = wrapAsync(async (req, res) => {
    let savedAdminId = null;
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ExpressError(400, 'Name and email are required.');
  }

  // Prevent duplicates
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ExpressError(400, 'A user with this email already exists.');
  }

  // Generate temporary password & hash
  const tempPassword = generatePassword();
  const salt         = await bcrypt.genSalt(10);
  const hashed       = await bcrypt.hash(tempPassword, salt);

  // Save admin user
  const newAdmin = new User({ name, email, password: hashed, role: 'admin' });
  const savedAdmin = await newAdmin.save();
  savedAdminId = savedAdmin._id;

  // Email credentials
  try {
    await emailService.sendAdminCreationEmail(email, name, tempPassword);
  } catch (emailError) {
    await User.findOneAndDelete({ email: email.toLowerCase() }).catch(() => {});
    throw new ExpressError(500, `Admin creation rolled back. Email failed: ${emailError.message}`);
  }

  res.status(201).json({ success: true, message: `Admin account created and credentials sent to ${email}.` });
});

/**
 * GET /api/admin/all-admins
 * Returns all admin-level users (excludes super-admins and customers)
 */
exports.getAllAdmins = wrapAsync(async (req, res) => {
  const admins = await User
    .find({ role: 'admin' })
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: admins.length, data: admins });
});

/**
 * PUT /api/admin/:id/toggle-status
 * Suspend (isActive:false) or reactivate (isActive:true) an admin
 */
exports.toggleAdminStatus = wrapAsync(async (req, res) => {
  const admin = await User.findOne({ _id: req.params.id, role: 'admin' });
  if (!admin) {
    throw new ExpressError(404, 'Admin not found.');
  }

  admin.isActive = !admin.isActive;
  await admin.save();

  const statusLabel = admin.isActive ? 'reactivated' : 'suspended';
  res.status(200).json({
    success: true,
    message: `Admin ${statusLabel} successfully.`,
    isActive: admin.isActive,
  });
});

/**
 * DELETE /api/admin/:id
 * Permanently delete an admin account
 */
exports.deleteAdmin = wrapAsync(async (req, res) => {
  const deleted = await User.findOneAndDelete({ _id: req.params.id, role: 'admin' });
  if (!deleted) {
    throw new ExpressError(404, 'Admin not found.');
  }
  res.status(200).json({ success: true, message: 'Admin deleted permanently.' });
});

// ─────────────────────────────────────────────────────────
//  COMPANY PROFILE
// ─────────────────────────────────────────────────────────

/**
 * GET /api/admin/company-profile
 * Fetch the single company profile document
 */
exports.getCompanyProfile = wrapAsync(async (req, res) => {
  const profile = await CompanyProfile.findOne();
  if (!profile) {
    throw new ExpressError(404, 'Company profile not found.');
  }
  res.status(200).json({ success: true, data: profile });
});

/**
 * PUT /api/admin/company-profile
 * Update the company profile (all fields optional — partial update)
 */
exports.updateCompanyProfile = wrapAsync(async (req, res) => {
  const updated = await CompanyProfile.findOneAndUpdate(
    {},
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!updated) {
    throw new ExpressError(404, 'Company profile not found.');
  }
  res.status(200).json({ success: true, message: 'Company profile updated.', data: updated });
});

// ─────────────────────────────────────────────────────────
//  ANALYTICS
// ─────────────────────────────────────────────────────────

/**
 * GET /api/admin/analytics
 * High-level dashboard stats — expand as Orders/Products models are added
 */
exports.getAnalytics = wrapAsync(async (req, res) => {
  const [
    totalAdmins,
    activeAdmins,
    suspendedAdmins,
    totalCustomers,
    activeCustomers,
    companyProfile,
  ] = await Promise.all([
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ role: 'admin', isActive: true }),
    User.countDocuments({ role: 'admin', isActive: false }),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'customer', isActive: true }),
    CompanyProfile.findOne().select('companyName brandName contactEmail createdAt'),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: {
        totalAdmins,
        activeAdmins,
        suspendedAdmins,
        totalCustomers,
        activeCustomers,
      },
      company: companyProfile || null,
      // Orders, revenue, products will be added here as those models are built
      orders: {
        total: 0,
        pending: 0,
        delivered: 0,
        revenue: 0,
      },
    },
  });
});
