const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse} = require('../controllers/courses controller');

const Course = require('../models/Course Model');
const commonFunctions = require('../middlwares/commonFunctions')

// call protect method
const {protect, authorize} = require('../middlwares/auth');

router.route('/')
    .get(commonFunctions(Course, {
            path: 'bootcamp',
            select: 'name description'
        }), getCourses)
    .post(protect, authorize('publisher', 'admin'), createCourse);
    

router.route('/:id')
    .get(getCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = router;