const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    // Определите необходимые поля схемы
    // Например, masterId, date, startTime, endTime и другие поля
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;