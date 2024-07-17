const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service', // Убедитесь, что 'Service' соответствует имени модели услуг
        required: true
    },
    timeslots: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TimeSlot'
        }
    ]
});

module.exports = mongoose.model('Master', masterSchema);
