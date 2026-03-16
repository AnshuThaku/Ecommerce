const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Please provide an email'], 
    unique: true, 
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Please provide a password'],
    minlength: 8
  },
  
  // Access Control Gateway
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'super-admin'], 
    default: 'customer' 
  },

  // Triggers the "Force Password Change" screen
  isFirstLogin: {
    type: Boolean,
    default: true 
  },

  // Allows you to suspend users without deleting their data
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);