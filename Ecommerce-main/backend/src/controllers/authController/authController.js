const User = require('../../models/User/userModel');
const Cart = require('../../models/cart/cartModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const wrapAsync = require('../../utils/errorHandler/wrapAsync');
const ExpressError = require('../../utils/errorHandler/expressError');

// --- LOGIN FUNCTION ---
exports.login = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ExpressError(400, 'Email and password are required.');
  }

  // 1. Verify email exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ExpressError(404, 'User not found.');
  }

  // 2. Check if user is active/banned
  if (!user.isActive) {
    throw new ExpressError(403, 'This account has been suspended.');
  }

  // 3. Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ExpressError(400, 'Invalid credentials.');
  }

  // 4. Generate JWT Token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  );

  // Send token in HTTP-only cookie
  res.cookie('token', token);

  // --- GUEST CART MERGE LOGIC START (For existing users logging in) ---
  const guestId = req.headers['x-guest-id'];
  if (guestId) {
    const guestCart = await Cart.findOne({ guestId: guestId });
    if (guestCart) {
      // Dekho agar login user ka pehle se apna cart hai
      const userCart = await Cart.findOne({ user: user._id });
      
      if (userCart) {
        // Agar uska pehle se cart hai, toh items array ko merge kar do
        userCart.items.push(...guestCart.items);
        await userCart.save();
        // Aur ye purana bekar ho gya, delete it
        await Cart.findByIdAndDelete(guestCart._id);
      } else {
        // Pehle se uska apna cart nai tha, to un-register cart use de do
        guestCart.guestId = null;
        guestCart.user = user._id;
        await guestCart.save();
      }
    }
  }
  // --- GUEST CART MERGE LOGIC END ---

  // 5. Send successful response with the user data
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin
    }
  });
});

// --- CUSTOMER REGISTRATION FUNCTION ---
exports.registerCustomer = wrapAsync(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    throw new ExpressError(400, 'Name, email, and password are required.');
  }

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ExpressError(400, 'Email is already registered.');
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create the new customer (role is default 'customer', isFirstLogin is false)
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    role: 'customer',           
    isFirstLogin: false     // Customers set their own password immediately
  });

  await newUser.save();

  // --- GUEST CART MERGE LOGIC START ---
  const guestId = req.headers['x-guest-id'];
  if (guestId) {
    // Agar frontend ne header me koi guest session id bheji hai, to use dhoondo
    const guestCart = await Cart.findOne({ guestId: guestId });
    if (guestCart) {
      // Us cart me se guestId hata do, aur naye User ki ID dal do
      guestCart.guestId = null;
      guestCart.user = newUser._id;
      await guestCart.save();
    }
  }
  // --- GUEST CART MERGE LOGIC END ---

  // 4. Generate token so they are automatically logged in upon signup (optional but good UX)
  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  );

  // Send token  cookie
  res.cookie('token', token);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// --- FORCE PASSWORD UPDATE FUNCTION ---
exports.updateFirstPassword = wrapAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
    
  if (!currentPassword || !newPassword) {
    throw new ExpressError(400, 'Current password and new password are required.');
  }

  // The user ID comes from the JWT middleware (we'll set this up next)
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ExpressError(404, 'User not found.');
  }

  // 1. Verify current temporary password is correct
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new ExpressError(400, 'Current password is incorrect.');
  }

  // 2. Hash and save the newly chosen password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // 3. Mark the user as fully onboarded so they aren't forced to change it again
  user.isFirstLogin = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password successfully updated. You may now access the dashboard.'
  });
});

// --- LOGOUT FUNCTION ---
exports.logout = wrapAsync(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});
