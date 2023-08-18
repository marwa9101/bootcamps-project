const express = require('express');
const dotEnv = require('dotenv');
const logger = require('./middlwares/logger');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middlwares/error');

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
