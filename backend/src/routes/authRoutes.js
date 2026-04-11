const express = require('express');
const router = express.Router();
const { login, updateFirstPassword, registerCustomer, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/ProfileController');

// Route: POST /api/auth/register
// Public route (customers signing up themselves)
router.post('/register', registerCustomer);

// Route: POST /api/auth/login
// Public route (anyone can try to log in)
router.post('/login', login);

// Route: GET /api/auth/logout
// Public/Protected route (clears the token cookie)
router.get('/logout', logout);

// Route: PUT /api/auth/update-password
// Protected route (you must have a valid JWT token to hit this endpoint)
router.put('/update-password', protect, updateFirstPassword);

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);


module.exports = router;