const express = require('express');
const router = express.Router();
const Masters = require('../models/Master');

// Получение всех мастеров
router.get('/', async (req, res) => {
    try {
        const masters = await Masters.find();
        res.json(masters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Создание нового мастера
router.post('/', async (req, res) => {
    const master = new Masters({
        name: req.body.name
    });

    try {
        const newMaster = await master.save();
        res.status(201).json(newMaster);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;