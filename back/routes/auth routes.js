const express = require('express');
const router = express.Router();
const { register, 
        login, 
        getCurrentUser, 
        forgotPassword,
        resetPassword } = require('../controllers/auth controller');

// call protect method
const {protect} = require('../middlwares/auth');

router.route('/register')
    .post(register);

router.route('/login')
    .post(login);

router.route('/current-user')
    .get(protect, getCurrentUser);

router.route('/forgot-password')
    .post(forgotPassword);

router.route('/resetPassword/:resetToken')
    .put(resetPassword);

module.exports = router;