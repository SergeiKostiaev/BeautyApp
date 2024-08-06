const sendToTelegram = require('../Telegram'); // Обратите внимание на корректный путь
const Booking = require('../models/Booking'); // Обратите внимание на корректный путь

// Пример создания бронирования
const createBooking = async (req, res) => {
    try {
        const newBooking = new Booking({
            date: req.body.date,
            time: req.body.time,
            customerName: req.body.customerName,
            customerPhone: req.body.customerPhone,
            isCancelled: false,
            booked: true
        });

        const savedBooking = await newBooking.save();
        const message = `Name: ${savedBooking.customerName}\nPhone: ${savedBooking.customerPhone}\nDate: ${savedBooking.date}\nTime: ${savedBooking.time}`;

        await sendToTelegram(message, savedBooking._id); // Передача _id вместо bookingId

        res.status(201).send(savedBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).send('Error creating booking');
    }
};

module.exports = createBooking;
