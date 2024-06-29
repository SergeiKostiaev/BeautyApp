const express = require('express');
const router = express.Router();
const Bookings = require('../models/booking'); // Предполагается, что у вас есть модель Bookings

// Получение всех бронирований
router.get('/', async (req, res) => {
    try {
        const bookings = await Bookings.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Создание нового бронирования
router.post('/', async (req, res) => {
    const { serviceId, customerName, customerPhone, date, time } = req.body;

    const booking = new Bookings({
        serviceId,
        customerName,
        customerPhone,
        date,
        time
    });

    try {
        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
