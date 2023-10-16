const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            'Please add a valid email address'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpired: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// encrypt password with bcrypt
UserSchema.pre('save', async function(next) {
    // si le password n'a pas été changé ne continue pas dans cette middleware
    // quand le user demande un reset token password il repasse par ce middleware, alors que il n'y a pas de password => il genere un errerur
    // c'est pour cela que j'ai ajouté cette condition
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

// sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Match user entered passsword to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPasssword) {
    return await bcrypt.compare(enteredPasssword, this.password)
}

// generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex'); // 20 is the number of bytes to be generated
    console.log(resetToken);

    // hash token
    this.resetPasswordToken = crypto.createHash('sha256')
                                    .update(resetToken)
                                    .digest('hex');
    // set the expire
    this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;
}   

module.exports = mongoose.model('User', UserSchema);