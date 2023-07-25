const express = require('express');
const dotEnv = require('dotenv');
const logger = require('./middlwares/logger');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');

// Load env vars
dotEnv.config({path: './config/config.env'});

//connect to database
connectDB();

const app = express();

// Dev logging middlware (just in dev environnement)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// // call logger middlware
// app.use(logger);

const routes = require('./routes/routes.js');
app.use('/api/v1/bootcamps', routes);


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`server running on ${process.env.NODE_ENV} mode on Port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => {process.exit(1)});
})
