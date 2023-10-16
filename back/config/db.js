const mongoose = require('mongoose');

const connectDB = async () => {
    const connectTodb = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`Mongo DB connected ${connectTodb.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;