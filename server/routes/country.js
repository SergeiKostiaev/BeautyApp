const express = require('express');
const router = express.Router();
const Country = require('../models/country'); // Путь к модели

router.get('/', async (req, res) => {
    try {
        const countries = await Country.find();
        res.json(countries);
    } catch (error) {
        console.error('Ошибка при получении стран:', error);
        res.status(500).json({ message: 'Ошибка при получении стран', error });
    }
});

module.exports = router;
