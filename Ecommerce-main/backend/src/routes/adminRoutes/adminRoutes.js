const router=require('express').Router()
const {getAllUsers}=require('../../controllers/adminController/adminController')
const {protect}=require('../../middleware/authMiddleware')
const {adminOnly}=require('../../middleware/roleMiddleware')

router.route('/users').get(protect,adminOnly,getAllUsers)

module.exports=router