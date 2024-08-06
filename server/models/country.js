const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use mongoose.models to avoid overwriting the model if it already exists
const Country = mongoose.models.Country || mongoose.model('Country', new Schema({
    name: {
        type: String,
        required: true
    }
}));

module.exports = Country;