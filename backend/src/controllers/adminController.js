const User = require('../models/userModel');
const Order = require('../models/orderModel');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/expressError');

// Get all customer users
module.exports.getAllUsers = wrapAsync(async (req, res) => {
  const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

// Get admin's own profile
module.exports.getAdminProfile = wrapAsync(async (req, res) => {
  const admin = await User.findById(req.user._id).select('-password');
  if (!admin) {
    throw new ExpressError(404, 'Admin not found.');
  }
  res.status(200).json({
    success: true,
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      isFirstLogin: admin.isFirstLogin,
      createdAt: admin.createdAt
    }
  });
});

// Update admin's own profile
module.exports.updateAdminProfile = wrapAsync(async (req, res) => {
  const { name, email, phone, address } = req.body;
  const admin = await User.findById(req.user._id);
  
  if (!admin) {
    throw new ExpressError(404, 'Admin not found.');
  }

  // Check if new email is already taken by another user
  if (email && email !== admin.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ExpressError(400, 'Email already in use.');
    }
  }

  admin.name = name || admin.name;
  admin.email = email ? email.toLowerCase() : admin.email;
  admin.phone = phone || admin.phone;
  admin.address = address || admin.address;

  const updatedAdmin = await admin.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    admin: {
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role
    }
  });
});

// Get all orders (for admin view)
module.exports.getAllOrders = wrapAsync(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('orderItems.product', 'name price images')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// Get order by ID
module.exports.getOrderById = wrapAsync(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('orderItems.product', 'name price images');

  if (!order) {
    throw new ExpressError(404, 'Order not found.');
  }

  res.status(200).json({ success: true, data: order });
});

// Update order status
module.exports.updateOrderStatus = wrapAsync(async (req, res) => {
  const { orderStatus } = req.body;
  const validStatuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(orderStatus)) {
    throw new ExpressError(400, 'Invalid order status.');
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus, deliveredAt: orderStatus === 'Delivered' ? Date.now() : null },
    { new: true, runValidators: true }
  ).populate('user', 'name email');

  if (!order) {
    throw new ExpressError(404, 'Order not found.');
  }

  res.status(200).json({ success: true, message: 'Order status updated.', data: order });
});