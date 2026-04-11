// backend/controllers/ThemeController.js
const Theme = require('../models/Theme');

// controllers/ThemeController.js

const festivalColorDictionary = {
  'Diwali': { 
    navBg: '#1A0F00',        // Header ka background (Dark Brown)
    btnBg: '#FF9933',        // Buttons ka background (Orange)
    highlightText: '#FF9933' // "Lightning Deals" jese text (Orange)
  },
  'Christmas': { 
    navBg: '#050D0A', 
    btnBg: '#D32F2F', 
    highlightText: '#D32F2F' 
  },
  'Default': { 
    navBg: '#0A0A0A',        // Normal dino mein Black Header
    btnBg: '#C8A253',        // Normal dino mein Gold Buttons
    highlightText: '#C8A253' // Normal dino mein Gold Text
  }
};


// 1. Theme fetch karne ka logic
module.exports.getActiveTheme = async (req, res) => {
  try {
    const today = new Date();
    const activeTheme = await Theme.findOne({
      isActive: true,
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    if (activeTheme) {
      const colors = festivalColorDictionary[activeTheme.festivalName] || festivalColorDictionary['Default'];
      return res.status(200).json({
        success: true,
        data: {
          ...activeTheme._doc,
          colors: colors
        }
      });
    }

    res.status(200).json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ⚡ 2. NAYA: Theme create karne ka logic (Jo missing tha) ⚡
module.exports.createTheme = async (req, res) => {
  try {
    const { campaignName, festivalName, startDate, endDate } = req.body;

    // Validation
    if (!campaignName || !festivalName || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newTheme = new Theme({
      campaignName,
      festivalName,
      startDate,
      endDate,
      isActive: true
    });

    await newTheme.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Theme successfully scheduled!",
      data: newTheme 
    });
  } catch (error) {
    console.error("Create Theme Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};