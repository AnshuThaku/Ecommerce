const express = require('express');
const router = express.Router();
const { registerCompany } = require('../../controllers/companyController/companyController');

// Route: POST /api/company/register
// Public route (used to initialize the MNC platform)
router.post('/register', registerCompany);

module.exports = router;