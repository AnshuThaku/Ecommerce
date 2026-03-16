const CompanyProfile = require('../../models/company/companyModel');
const User = require('../../models/User/userModel');
const bcrypt = require('bcryptjs');
const generatePassword = require('../../utils/generatePassword');
const emailService = require('../../services/emailService/emailService');
const wrapAsync = require('../../utils/errorHandler/wrapAsync');
const ExpressError = require('../../utils/errorHandler/expressError');

exports.registerCompany = wrapAsync(async (req, res) => {
  let newCompanyId = null;
  let SuperAdminId = null;

  const formData = req.body;
  const companyEmail = formData.contactEmail;

  if (!companyEmail) {
    throw new ExpressError(400, 'Company contact email is required.');
  }

  const companyExists = await CompanyProfile.findOne();
  if (companyExists) {
    throw new ExpressError(403, 'Company is already registered. This action is not allowed.');
  }

  const existingUser = await User.findOne({ email: companyEmail });
  if (existingUser) {
    throw new ExpressError(400, 'A user with this email already exists in the system.');
  }

  const tempPassword = generatePassword();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(tempPassword, salt);

  const founderName = formData.founders && formData.founders.length > 0
    ? formData.founders[0].name
    : 'Truee Admin';

  const newAdmin = new User({
    name: founderName,
    email: companyEmail,
    password: hashedPassword,
    role: 'super-admin'
  });
   const savedAdmin = await newAdmin.save();
 SuperAdminId = savedAdmin._id;
    
  const newCompany = new CompanyProfile({
    ...formData
  });
    const savedCompany = await newCompany.save();
    newCompanyId = savedCompany._id;
await newCompany.save();

  try {
    await emailService.sendWelcomeEmail(companyEmail, founderName, tempPassword);
  } catch (emailError) {
    // Rollback: delete the created admin and company if email fails
    await User.findByIdAndDelete(SuperAdminId).catch(() => {});
    await CompanyProfile.findByIdAndDelete(newCompanyId).catch(() => {});
    throw new ExpressError(500, `Registration rolled back. Email failed: ${emailError.message}`);
  }

  res.status(201).json({
    success: true,
    message: 'Company registered successfully. Credentials sent.'
  });
});