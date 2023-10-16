const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlwares/async');
const User = require('../models/User Model');

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
