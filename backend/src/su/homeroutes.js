const express = require('express');
const router = express.Router();
const {getHomePageData} = require('../controllers/homecontroller');
const { optionalProtect } = require('../middleware/authMiddleware');

router.get('/', optionalProtect, getHomePageData);

module.exports = router;