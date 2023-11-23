// create and store JWT Token in HTTP only cookie

const sendToken = (user, statusCode, res) => {
    // Create JWT Token
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}

module.exports = sendToken;