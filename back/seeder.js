const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({path: './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp Model');
const Course = require('./models/Course Model');
const User = require('./models/User Model');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Read Json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'UTF8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'UTF8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'UTF8'));

// Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        console.log(`Data imported ... `.green.inverse)
    } catch (err) {
        console.log(err);
    }
}

// Delete data in DB
const deletetData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        console.log(`Data destroyed ... `.red.inverse)
    } catch (err) {
        console.log(err);
    }
}

// commands lignes variables definition
if (process.argv[2]=== '-import') {
    importData();
} else if (process.argv[2]=== '-delete') {
    deletetData();
}