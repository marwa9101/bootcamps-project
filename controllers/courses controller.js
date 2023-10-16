const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlwares/async');
const Course = require('../models/Course Model');
const Bootcamp = require('../models/Bootcamp Model');

/*  @desc Get all courses and get all courses of a specific bootcamp
    @route GET /api/v1/courses
    @route GET /api/v1/bootcamps/:bootcampId/courses
    @access Public 
*/
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.commonFunctions); 
    }

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

/*  @desc Create a course in a specific bootcamp
    @route POST /api/v1/bootcamps/:bootcampId/courses
    @access Private
*/
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with the id ${req.params.bootcampId}`, 404));
    }

    // Make sure that the user logged in is the bootcamp owner
    if (req.user.id !== bootcamp.user.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user with id ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`));
    }

    const course = await Course.create(req.body);
    res.status(200).json({
        success: true,
        data: course
    })
});

/*  @desc Update a course
    @route PUT /api/v1/courses/:id
    @access Private
*/
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course found with the id ${req.params.id}`));
    }
    console.log(`here is the course ${course}`);

    // Make sure user is course owner
    if (req.user.id !== course.user.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user with the id ${req.user.id} is not authorized to update this course ${course._id}`));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: course
    })
});

/*  @desc Delete a course
    @route PUT /api/v1/courses/:id
    @access Private
*/
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    
    const course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`No course found with the id ${req.params.id}`));
    }
    console.log(course.user)
    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user with the id ${req.user.id} is not authorized to delete this course ${course._id}`));
    }
    
    await course.deleteOne();
    res.status(200).json({
        success: true,
        message: `the course with the id ${req.params.id} was successefully removed`
    })
});

