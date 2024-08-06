const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    masterId: { type: mongoose.Schema.Types.ObjectId, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    date: { type: String, required: true },
    booked: { type: Boolean, default: false },
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);