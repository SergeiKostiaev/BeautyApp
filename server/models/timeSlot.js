const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    masterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Master',
        required: true
    },
    date: {
        type: String,  // Assuming the date is stored as a string in "YYYY-MM-DD" format
        required: true
    }
}, {
    timestamps: true
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
