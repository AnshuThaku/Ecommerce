const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  brandName: { type: String, default: 'Truee Luxury' },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  
  // Legal & Tax Details
  taxDetails: {
    gstNumber: { type: String, required: true, unique: true },
    panNumber: { type: String, required: true },
  },

  // Address
  registeredAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },

  // Bank Details for Payouts
  bankDetails: {
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    branch: { type: String }
  },

  // Founder(s) Information
  founders: [{
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    designation: { type: String, default: 'Founder' }
  }],

}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);