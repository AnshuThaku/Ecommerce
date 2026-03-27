const jwt = require('jsonwebtoken');
const User = require('../models/User/userModel');

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in cookies OR in headers
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 🚨 THE FIX: Agar token "null" ya "undefined" string ban kar aaya hai, toh use null kar do
  if (token === 'null' || token === 'undefined') {
    token = null;
  }

  // 2. Check agar sach mein koi token nahi hai
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided.' });
  }

  try {
    // 3. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user in the database and attach them to req.user (excluding password)
    req.user = await User.findById(decoded.id).select('-password');
    
    // 5. Move on to the next function
    next();
  } catch (error) {
    // Console error ko clean rakhte hain taaki poora terminal na bhare
    console.error("Token Verification Error:", error.message); 
    return res.status(401).json({ success: false, error: 'Not authorized, token failed.' });
  }
};
// ... (Aapka purana protect function yahan upar rahega) ...

exports.optionalProtect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Strictly check for valid token string
  if (token && token !== 'null' && token !== 'undefined') {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // ⚡ FIX: Sirf tabhi log karo agar message 'invalid signature' ke alaawa kuch ho
      // Ya phir isse puri tarah silent kar do taaki terminal saaf rahe
      // console.error("Optional Token Error:", error.message); 
      req.user = null; 
    }
  }

  next(); 
};