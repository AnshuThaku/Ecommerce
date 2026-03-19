const express = require('express');
const router = express.Router();
const { getHistory, trackHistory } = require('../../controllers/historyController/historyController');

// 👇 1. 'protect' ki jagah 'optionalProtect' import kiya
const { optionalProtect } = require('../../middleware/authMiddleware');

// 👇 2. Isko update kiya taaki Guests aur Logged-in users dono aa sakein
router.use(optionalProtect);

// Routes
router.post('/add', trackHistory); 
router.get('/', getHistory); 

module.exports = router;