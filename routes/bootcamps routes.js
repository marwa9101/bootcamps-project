const express = require('express');
const router = express.Router();
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampWithinRadius,
    uploadBootcampPhoto
} = require('../controllers/bootcamps controller')

const commonFunctions = require('../middlwares/commonFunctions');
const Bootcamp = require('../models/Bootcamp Model');

// Include other resource routers
const coursesRouter = require('./courses routes');

// Re-route into other resource routers
router.use('/:bootcampId/courses', coursesRouter);

// call protect method
const {protect, authorize} = require('../middlwares/auth');

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), uploadBootcampPhoto);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampWithinRadius);

router.route('/')
    .get(commonFunctions(Bootcamp, 'courses'), getBootcamps) // a chaque fois ce route est appelé il y a un middleware qui est appelé aussi
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;