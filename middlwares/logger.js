/**
 * @desc logs
 */

const logger = (req, res, next) => {
    req.logger = `${req.method} ${req.protocol}://${req.get('host')}${req.url}`;
    // method (get) http://localhost:5000/api/v1/bootcamps
    console.log (req.logger);
    next();
}

module.exports=logger;