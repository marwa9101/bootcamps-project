const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlwares/async');
const User = require('../models/User Model');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc Register a user
// @route POST api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;
    
    // create user
    const user = await User.create({
        name, // name: name, email: email, password: password, role: role
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res);

});

// @desc Login a user
// @route POST api/v1/auth/register
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    
    // validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    // check for user
    const user = await User.findOne({email: email}).select('+password'); // select pour envoyer le password dans cette requette, dans le model est false pour ne pas l'envoyer

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    sendTokenResponse(user, 200, res);
});

// @desc GET current user
// @route GET api/v1/auth/currentUser
// @access Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc Forgot password
// @route POST api/v1/auth/forgotpassword
// @access Private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const userEmail = req.body.email;
    let user = await User.findOne({ email: userEmail });
    console.log(user.resetPasswordToken);

    if (!user) {
        return next(new ErrorResponse(`User not found with this email ${userEmail}`, 404))  
    }

    // if user exist we will get a new reset token
    await user.getResetPasswordToken();

    // get the reset password token returned from the call of getResetPasswordToken function
    const resetToken = user.resetPasswordToken

    // save the user in DB
    await user.save({ validateBeforeSave: false});

    // create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`;
    const message = `You are recieving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });
        res.status(200).json({
            success: true,
            data: 'Email sent successfully'
        })
    
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpired = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorResponse(`Email could not be sent: ${err}`, 500))  
    }
})
// @desc Reset password
// @route PUT api/v1/auth/resetPassword/:resetToken
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get token from URL and hash it
    const resetPasswordToken = crypto.createHash('sha256')
                                     .update(req.params.resetToken)
                                     .digest('hex');
    console.log ('resetPasswordToken'+ resetPasswordToken);
    console.log ("la date actuelle : " + Date.now());
    // find user that has this resetPasswordToken
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpired: { $gt: Date.now() } // le champs resetPasswordToken doit etre supperieur à l'heure actuel (not expired)
    })

    if (!user) {
        return next(new ErrorResponse(`Invalid token`, 400))  
    }

    // if user exist update the password of this user after get it from body request
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    await user.save();
    // Get token from model, create cookie and send token inside res.cookie
    sendTokenResponse(user, 200, res);
})

// Get token from model, create cookie and send token inside res.cookie
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken();

    // create options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // 1000 pour milliseconde
        httpOnly: true
    }

    // secure if production environement
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    // create and send the cookie
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}
