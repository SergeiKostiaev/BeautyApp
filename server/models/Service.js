const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    }
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

module.exports = Service;
