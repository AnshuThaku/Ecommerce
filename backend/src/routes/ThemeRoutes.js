const express = require('express');
const router = express.Router();
const ThemeController = require('../controllers/ThemeController');

router.get('/active', ThemeController.getActiveTheme);
router.post('/create',  ThemeController.createTheme);

module.exports = router;