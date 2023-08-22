const express = require('express');
const dotEnv = require('dotenv');
const logger = require('./middlwares/logger');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middlwares/error');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotEnv.config({path: './config/config.env'});

//connect to database
connectDB();

const app = express();

// Body Parser middleware
app.use(express.json());

// Dev logging middlware (just in dev environnement)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// // call logger middlware
// app.use(logger);

const bootcampsRoutes = require('./routes/bootcamps routes');
const coursesRoutes = require('./routes/courses routes')
app.use('/api/v1/bootcamps', bootcampsRoutes);
app.use('/api/v1/courses', coursesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`server running on ${process.env.NODE_ENV} mode on Port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => {process.exit(1)});
})
