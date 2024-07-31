const express = require('express');
const router = express.Router();
const Bookings = require('../models/Booking'); // Предполагается, что у вас есть модель Bookings
const TimeSlot = require('../models/timeSlot'); // Модель временных слотов
const sendToTelegram = require('../Telegram');
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
        // Сохраняем бронирование
        const newBooking = await booking.save();

        // Обновляем временной слот, чтобы отметить его как забронированный
        const timeSlot = await TimeSlot.findOne({ serviceId, date, startTime: time });
        if (timeSlot) {
            timeSlot.booked = true;
            await timeSlot.save();
        }

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Получение доступных временных слотов для мастера на определенную дату
router.get('/api/time-slots/master/:masterId', async (req, res) => {
    const { masterId } = req.params;
    const { date } = req.query;

    try {
        // Найти все временные слоты на заданную дату и мастера
        const timeSlots = await TimeSlot.find({ masterId, date });

        // Найти все забронированные временные слоты на эту дату
        const bookings = await Bookings.find({ masterId, date });

        // Обновить доступность временных слотов на основе существующих записей
        const updatedTimeSlots = timeSlots.map(slot => {
            const isBooked = bookings.some(booking => booking.time === slot.startTime);
            return {
                ...slot.toObject(),
                isAvailable: !isBooked // Обновляем доступность на основе наличия бронирования
            };
        });

        res.json(updatedTimeSlots);
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).send('Server error');
    }
});

// Удаление бронирования
router.delete('/:bookingId', async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Найти бронирование и удалить его
        const booking = await Bookings.findByIdAndDelete(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Найти временной слот, который был забронирован
        const timeSlot = await TimeSlot.findOne({
            masterId: booking.masterId,
            date: booking.date,
            startTime: booking.time
        });

        if (timeSlot) {
            // Обновить временной слот, чтобы сделать его доступным
            timeSlot.booked = false;
            timeSlot.available = true; // Убедитесь, что это свойство существует и обновляется
            await timeSlot.save();
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const { masterId, customerName, customerPhone, date, time } = req.body;

    try {
        const newBooking = new Booking({ masterId, customerName, customerPhone, date, time });
        await newBooking.save();

        // Отправка уведомления в Telegram с кнопкой отмены
        sendToTelegram(`New booking:\nName: ${customerName}\nPhone: ${customerPhone}\nDate: ${date}\nTime: ${time}`, newBooking._id);

        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/cancel', async (req, res) => {
    const { bookingId } = req.body;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.isCancelled = true;
        await booking.save();

        const timeSlot = await TimeSlot.findOne({
            masterId: booking.masterId,
            date: booking.date,
            startTime: booking.time
        });

        if (timeSlot) {
            timeSlot.booked = false;
            timeSlot.available = true;
            await timeSlot.save();
        }

        res.status(200).json({ message: 'Booking cancelled successfully' });

        // Отправка уведомления в Telegram
        sendToTelegram(`Booking cancelled:\nName: ${booking.customerName}\nPhone: ${booking.customerPhone}\nDate: ${booking.date}\nTime: ${booking.time}`);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
