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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    timeslots: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TimeSlot'
        }
    ]
}, {
    timestamps: true // Добавляет createdAt и updatedAt поля в документ
});

module.exports = mongoose.model('Master', masterSchema);
