const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/timeSlot'); // Убедитесь, что путь к модели правильный

// Получение всех временных интервалов
router.get('/', async (req, res) => {
    try {
        const timeSlots = await TimeSlot.find();
        res.json(timeSlots);
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).json({ message: error.message });
    }
});

// Маршрут для получения временного интервала по ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const timeSlot = await TimeSlot.findById(id);
        if (!timeSlot) {
            return res.status(404).json({ message: 'Временной интервал не найден' });
        }
        res.json(timeSlot);
    } catch (error) {
        console.error('Ошибка при получении временного интервала:', error);
        res.status(500).json({ message: 'Ошибка при получении временного интервала', error });
    }
});



// // Создание нового временного интервала
// router.post('/', async (req, res) => {
//     const { startTime, endTime } = req.body;
//
//     const timeSlot = new TimeSlot({
//         startTime,
//         endTime
//     });
//
//     try {
//         const newTimeSlot = await timeSlot.save();
//         res.status(201).json(newTimeSlot);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

module.exports = router;
