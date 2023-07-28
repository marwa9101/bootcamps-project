const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp Model')

/*  @desc Get all bootcamps
    @route GET /api/v1/bootcamps
    @access Public 
*/
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (err) {
        next(err);
    }
    
}

/*  @desc Get one bootcamp
    @route GET /api/v1/bootcamps/:id
    @access Public
*/
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        // if id requested is correctely formatted but doesn't existe in the DB
        // Handle this error, we have make sure to return this response since wa 
        //have 2 responses possible in this code
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        next(err);
    }
}

/*  @desc Create a bootcamp
    @route POST /api/v1/bootcamps/
    @access Public
*/
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        next(err);
    }
}

/*  @desc Update a bootcamp
    @route PUT /api/v1/bootcamps/:id
    @access Private
*/
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        next(err);
    }
}

/*  @desc Delete a bootcamp
    @route DELETE /api/v1/bootcamps/:id
    @access Private
*/
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await (Bootcamp.findByIdAndRemove(req.params.id));
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (err) {
        next(err);
    }
    
}