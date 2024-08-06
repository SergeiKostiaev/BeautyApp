// routes/services.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Service = require('../models/Service');

// Настройка multer для хранения файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    }
});

// Маршрут для добавления новой услуги с загрузкой изображения
router.post('/new', upload.single('image'), async (req, res) => {
    try {
        const { name, country, cost } = req.body;
        if (!req.file) {
            throw new Error('Image file is required');
        }
        if (!name || !country || !cost) {
            throw new Error('Missing required fields');
        }
        const imageUrl = '/uploads/' + req.file.filename;
        const newService = new Service({ name, imageUrl, country, cost });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        console.error('Error adding service:', error.message);
        res.status(500).json({ message: 'Error adding service', error: error.message });
    }
});

// Получение всех услуг или фильтрация по стране
router.get('/', async (req, res) => {
    const { country } = req.query;
    try {
        const filter = country ? { country } : {};
        const services = await Service.find(filter);
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Error fetching services' });
    }
});

module.exports = router;
