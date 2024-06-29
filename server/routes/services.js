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
    limits: { fileSize: 1024 * 1024 * 5 }, // Ограничение размера файла до 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Неподдерживаемый тип файла'), false);
        }
    }
});

// Маршрут для добавления новой услуги с загрузкой изображения
router.post('/services/new', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const newService = new Service({
            name,
            imageUrl
        });

        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        console.error('Ошибка при добавлении услуги:', error);
        res.status(500).json({ message: 'Ошибка при добавлении услуги', error });
    }
});

module.exports = router;
