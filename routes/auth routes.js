const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/auth controller');

// call protect method
const {protect} = require('../middlwares/auth');

router.route('/register')
    .post(register);

router.route('/login')
    .post(login);

router.route('/current-user')
    .get(protect, getCurrentUser);

module.exports = router;