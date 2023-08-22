const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlwares/async');
const geoCoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp Model')
const path = require('path');

/*  @desc Get all bootcamps
    @route GET /api/v1/bootcamps
    @access Public 
*/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.commonFunctions);   
});

/*  @desc Get one bootcamp
    @route GET /api/v1/bootcamps/:id
    @access Public
*/
exports.getBootcamp = asyncHandler(async (req, res, next) => {
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
});

/*  @desc Create a bootcamp
    @route POST /api/v1/bootcamps/
    @access Public
*/
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

/*  @desc Update a bootcamp
    @route PUT /api/v1/bootcamps/:id
    @access Private
*/
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
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
});

/*  @desc Delete a bootcamp
    @route DELETE /api/v1/bootcamps/:id
    @access Private
*/
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    await bootcamp.deleteOne();
    res.status(200).json({
        success: true,
        data: {}
    })
});

/*  @desc Get a bootcamp within a specific radius using a zipcode and distance
    @route GET /api/v1/bootcamps/radius/:zipcode/:distance
    @access Private
*/
exports.getBootcampWithinRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    // Get latitude and longitude from geocoder
    const location = await geoCoder.geocode(zipcode);
    const latitude = location[0].latitude;
    const longitude = location[0].longitude;

    // calculate the radius using radians
    // Divaide distance by radius of Earth
    // Earth Radius = 3.963 miles = 6.378 kilometers
    const radius = distance / 3963;

    // find bootcamps with the location that has these long and lat
    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: { $centerSphere: [ [ longitude, latitude ], radius ] }}
    });
    res.status(200).json({success: true, count: bootcamps.length, data: bootcamps});
});

/*  @desc Upload a bootcamp' photo
    @route PUT /api/v1/bootcamps/:id/photo
    @access Private
*/
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    if (!req.files) { // if the files objet in the req not exist
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    const file = req.files.file;
    
    // Verify if the file is a photo
    if(!file.mimetype.startsWith('image/')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // check file size
    if(file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400));  
    }

    // create custom filename (photo name)
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async function (err) {
        if (err) {
            return next(new ErrorResponse(`Problem with file upload`, 500));  
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});
        
        res.status(200).json({
            success: true,
            data: file.name
        })
    })
});

