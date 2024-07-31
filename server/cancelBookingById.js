const mongoose = require('mongoose');
const Booking = require('./models/Booking'); // Убедитесь, что путь к модели правильный

const cancelBookingById = async (bookingId) => {
    try {
        // Найти бронирование по ID и обновить поле booked
        const result = await Booking.findByIdAndUpdate(
            bookingId,
            { booked: false },
            { new: true } // Опция возвращает обновленный документ
        );

        if (!result) {
            throw new Error('Booking not found');
        }

        console.log('Booking canceled successfully:', result);
        return result;
    } catch (error) {
        console.error('Error canceling booking:', error);
        throw error;
    }
};

module.exports = cancelBookingById;