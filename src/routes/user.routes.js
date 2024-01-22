import express from 'express'
import { registerUser, loginUser, logoutUser, changePassword, deleteUser, getCurrentUserDetails } from '../controllers/user.controller.js'
import verifyUser from '../middlewares/verifyUser.middleware.js'

const router = express.Router()

// route for registering a new user
router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/logout').post(verifyUser,logoutUser)

router.route('/change-password').post(verifyUser,changePassword)

router.route('/getCurrentUser').get(verifyUser,getCurrentUserDetails)

router.route('/delete-account').post(verifyUser,deleteUser)

export default router