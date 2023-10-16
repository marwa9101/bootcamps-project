const asyncHandler = require("./async");
const User = require('../models/User Model');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // verifier si il y a un token envoyé dans la requette
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // recuperer le token depuis les headers (sans Bearer)
        token = req.headers.authorization.split(' ')[1];
    }
    // verifier si il y a un token envoyé dans des cookies
    // else if (req.cookies.token) {
    //     token = req.cookies.token
    // }

    // verifier si le token exist
    if (!token) {
        return next(new ErrorResponse('not authorized to access this page', 401));
    }

    // if le token exist
    try {
        // extract the payload from the token
        // the payload is like this : { id: '', iat: xxx, expiration: ''}
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        console.log(req.user);
        next();
    } catch (err) {
        return next(new ErrorResponse('Sorry, not authorized to access this page', 401));
    }
});

// Grantie access to a specific role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this page`, 403));
        }
        next();
    }
}