const express =require("express")
const router = express.Router()
const {loginUser, registerUser, changePassword, updateUser} = require('../controllers/authController')


router.post('/user/login', loginUser)
router.post('/user/register', registerUser)
router.put('/user/changepassword', changePassword)
router.patch('/user/updateuser', updateUser)


module.exports = router