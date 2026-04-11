const User=require('../models/userModel')
module.exports.getAllUsers=async(req,res)=>{
  const users=await User.find({ role: 'customer' })
  res.json({ users });

}