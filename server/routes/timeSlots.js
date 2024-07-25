const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/timeSlot');

// Получение временных интервалов по ID мастера и дате
router.get('/master/:masterId', async (req, res) => {
    const { masterId } = req.params;
    const { date } = req.query;
    try {
        const timeSlots = await TimeSlot.find({ masterId, date });
        if (!timeSlots || timeSlots.length === 0) {
            return res.status(404).json({ message: 'Слоты времени не найдены для указанного мастера' });
        }
        res.json(timeSlots);
    } catch (error) {
        console.error('Ошибка при получении слотов времени:', error);
        res.status(500).json({ message: 'Ошибка при получении слотов времени', error });
    }
});
// Создание временных слотов для определенного мастера
router.post('/master/:masterId', async (req, res) => {
    const { masterId } = req.params;
    const { startTime, endTime, date } = req.body;

    try {
        const newTimeSlot = new TimeSlot({ masterId, startTime, endTime, date });
        await newTimeSlot.save();
        res.status(201).json(newTimeSlot);
    } catch (error) {
        console.error('Ошибка создания временного интервала:', error);
        res.status(400).json({ message: 'Ошибка создания временного интервала', error: error.message });
    }
});

// Создание нового временного интервала
router.post('/', async (req, res) => {
    const { startTime, endTime, masterId, date } = req.body;

    try {
        const newTimeSlot = new TimeSlot({ startTime, endTime, masterId, date });
        await newTimeSlot.save();

        res.status(201).json(newTimeSlot);
    } catch (error) {
        console.error('Error creating time slot:', error);
        res.status(400).json({ message: 'Ошибка создания временного интервала', error: error.message });
    }
});

// Маршрут для получения всех слотов времени
router.get('/', async (req, res) => {
    try {
        const timeSlots = await TimeSlot.find();
        res.json(timeSlots);
    } catch (error) {
        console.error('Ошибка при получении слотов времени:', error);
        res.status(500).json({ message: 'Ошибка при получении слотов времени', error });
    }
});

module.exports = router;
