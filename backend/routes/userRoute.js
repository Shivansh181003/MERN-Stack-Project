const express = require('express');
const { registerUser, loginUser, logout, logoutUser, forgotPassword, resetPassword, getUserProfile } = require('../controllers/userController');
const router = express.Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(getUserProfile)

module.exports = router;