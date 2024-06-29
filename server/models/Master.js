const mongoose = require('mongoose');

const masterSchema = new mongoose.Schema({
    name: String,
    serviceId: mongoose.Schema.Types.ObjectId,
});

const Master = mongoose.models.Master || mongoose.model('Master', masterSchema);

module.exports = Master;
