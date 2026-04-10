const path = require('path');
// Ye line backend folder ki .env file ka exact rasta bata degi
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/product/productModel.js'); 
const productsData = require('./data.js'); 
const { connectDb } = require('../config/db.js'); 
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const importData = async () => {
  try {
    // 1. SABSE PEHLE: Database connect hone ka wait karein
    console.log('⏳ Database se connect ho rahe hain...');
    await connectDb(); 
    console.log('✅ Database Connection Successful!');

    // 2. USKE BAAD: Data insert karein
    console.log(`⏳ ${productsData.length} Naye Products database mein add ho rahe hain...`);
    await Product.insertMany(productsData);

    console.log('🎉 SUCCESS: Naye products purane products ke sath jud gaye hain!');
    process.exit(0); // Script ko success ke sath band karein
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1); // Script ko error ke sath band karein
  }
};

importData();