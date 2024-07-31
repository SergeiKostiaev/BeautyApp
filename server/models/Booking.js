// const mongoose = require('mongoose');
//
// const bookingSchema = new mongoose.Schema({
//     masterId: mongoose.Schema.Types.ObjectId,
//     serviceId: mongoose.Schema.Types.ObjectId,
//     date: String,
//     time: String,
//     customerName: String,
//     customerPhone: String,
//     isCancelled: { type: Boolean, default: false },
//     booked: { type: Boolean, default: true }
// });
//
// const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
//
// module.exports = Booking;

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    masterId: mongoose.Schema.Types.ObjectId,
    customerName: String,
    customerPhone: String,
    date: String,
    time: String,
    booked: Boolean,
    isCancelled: Boolean
});

module.exports = mongoose.model('Booking', bookingSchema);
