const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middelware/catchAsyncError');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtTokens');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register a user => /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'this is a sample id',
            url: 'profilepic.jpg'
        }
    })

    sendToken(user, 201, res)
})

// Login User => /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res)
})

// Logout user => /api/v1/logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler('User not found', 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}?email=${user.email}`;

    const message = `Your password reset token is as follow:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, then ignore it.`
    // console.log(message);
    try {
        await sendEmail({
            email: user.email,
            subject: 'E-Commerce Password Recovery',
            message
        })
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })
        
        return next(new ErrorHandler(err.message, 500))
    }

})

// Reset Password => /api/v1/password/reset/:token?email=${user.email}
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({ 
        resetPasswordToken, 
        resetPasswordExpire: { $gt: Date.now() },
        email: req.query.email 
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    sendToken(user, 200, res)
})

// Get currently logged in user details => /api/v1/me

// Update / Change password => /api/v1/password/update

// Update user profile => /api/v1/me/update

// Admin Routes

// Get all users => /api/v1/admin/users

// Get user details => /api/v1/admin/user/:id

// Update user profile => /api/v1/admin/user/:id

// Delete user => /api/v1/admin/user/delete/:id

// 
