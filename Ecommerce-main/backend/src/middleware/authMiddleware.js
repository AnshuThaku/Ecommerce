const jwt = require('jsonwebtoken');
const User = require('../models/User/userModel');

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in cookies OR in headers
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided.' });
  }

  try {
    // 3. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user in the database and attach them to req.user (excluding their password)
    req.user = await User.findById(decoded.id).select('-password');
    
    // 5. Move on to the next function (the controller)
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    return res.status(401).json({ success: false, error: 'Not authorized, token failed.' });
  }
};