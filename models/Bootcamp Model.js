const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder')

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 50 characters'],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS protocols'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            'Please add a valid email address'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        // GeoJSON point type of the location
        type: {
            type: String,
            enum: ['Point'],
            required: false
          },
          coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'
          },
          formattedAddress: String,
          street: String,
          city: String,
          state: String,
          zipcode: String,
          country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, 
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// middleware (hook) to create bootcamp slug from the name
BootcampSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower:true});
    next();
})

// Geocode and create location field
BootcampSchema.pre('save', async function(next) {
    const location = await geocoder.geocode(this.address);
    this.location = {
        type:'Point',
        coordinates: [location[0].longitude, location[0].latitude],
        formattedAddress: location[0].formattedAddress,
        street: location[0].streetName,
        city: location[0].city,
        state: location[0].stateCode,
        zipcode: location[0].zipcode,
        country: location[0].countryCode
    };
    // Don't save address in db
    this.address = undefined;
    next();
});

// Cascade delete courses when the bootcamp is deleted
BootcampSchema.pre('deleteOne', { document: true }, async function (next) {
    console.log('hello delete')
    await this.model('Course').deleteMany({ bootcamp: this._id});
    console.log(`courses been removed from bootcamp ${this._id}`);
    next();
})

// Reverse populate with virtuals
BootcampSchema.virtual('courses', {
    ref: 'Course', // reference for the model Course
    localField: '_id', // le id du bootcamp
    foreignField: 'bootcamp', // en relation avec le bootcamp chamo du course model
    justOne: false // ca ne concerne pas un seul course mais plusieur => courses = [course1, course2, etc ...]
})

module.exports= mongoose.model('Bootcamp', BootcampSchema)