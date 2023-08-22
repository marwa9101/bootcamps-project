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

router.route('/')
    .get(commonFunctions(Course, {
            path: 'bootcamp',
            select: 'name description'
        }), getCourses)
    .post(createCourse);
    

router.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse)

module.exports = router;