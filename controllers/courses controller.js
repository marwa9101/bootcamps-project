const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlwares/async');
const Course = require('../models/Course Model')

/*  @desc Get all courses and get all courses of a specific bootcamp
    @route GET /api/v1/courses
    @route GET /api/v1/bootcamps/:bootcampId/courses
    @access Public 
*/
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({bootcamp: req.params.bootcampId}).populate({
            path: 'bootcamp',
            select: 'name description'
        });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;
    res.status(200).json({
        success: true,
        cout: courses.length,
        data: courses
    })
});

/*  @desc Get a single course
    @route GET /api/v1/courses/:id
    @access Public 
*/
exports.getCourse = asyncHandler(async (req, res, next) => {
        const course = await Course.findById(req.params.id).populate({
            path: 'bootcamp',
            select: 'name description'
        });
    if (!course) {
        return next(new ErrorResponse(`No course found with the id ${req.params.id}`));
    };
    res.status(200).json({
        success: true,
        data: course
    });
});
