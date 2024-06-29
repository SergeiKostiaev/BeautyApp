const mongoose = require('mongoose');

// Определение схемы временного интервала
const timeSlotSchema = new mongoose.Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
});

// Создание модели временного интервала на основе схемы
const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;