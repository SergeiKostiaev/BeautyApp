const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule'); // Подключаем модель для расписания

// Маршрут для получения расписания по ID
router.get('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: 'Расписание не найдено' });
        }
        res.json(schedule);
    } catch (error) {
        console.error('Ошибка при получении расписания:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;