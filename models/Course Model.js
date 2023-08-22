const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add a number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

// static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const averageobj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId} // dans ce model de course si le bootcamp est le meme que le bootcampId demandé match le et passe à l'etape suivante
        },
        {
            $group: {
                _id: '$bootcamp', // regrouper les courses qui ont le meme bootcamp [cours1, cours3, cours6]
                averageCost: { $avg: '$tuition'} // pour ce bootcamp créer un nouveau attribut averageCost et get le average (le moyen) de tout les cours tuitions qui sont dedans averagecost : [tuition cours1, tuitions cours 3, tuitions cours 6]
            }
        }
    ])
    try {
        // save the averageCost in the bootcamp model
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(averageobj[0].averageCost / 10) * 10
        })
    } catch (error) {
        console.log(error);
    }
}
// we want to calculate the average cost after adding a course and before removing a course
// Call getAverageCost after save
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp) // on save will gonna save the new course qui has the bootcampId
})

// Call getAverageCost before remove
CourseSchema.post('deleteOne', { document: true }, function () {
    this.constructor.getAverageCost(this.bootcamp) // on save will gonna save the new course qui has the bootcampId
})

module.exports = mongoose.model('Course', CourseSchema);