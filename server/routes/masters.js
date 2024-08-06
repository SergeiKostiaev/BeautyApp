const express = require('express');
const router = express.Router();
const multer = require('multer');
const Master = require('../models/Master');

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

// Получение всех мастеров
router.get('/', async (req, res) => {
    try {
        const masters = await Master.find().populate('service').populate('country');
        res.json(masters);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Обновление мастера
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, imageUrl, service, country } = req.body;

        const updatedMaster = await Master.findByIdAndUpdate(id, {
            name,
            imageUrl,
            service,
            country
        }, { new: true });

        if (!updatedMaster) {
            return res.status(404).json({ message: 'Master not found' });
        }

        res.json(updatedMaster);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Удаление мастера
router.delete('/:id', async (req, res) => {
    const masterId = req.params.id;

    if (!masterId) {
        return res.status(400).json({ message: 'Invalid master ID' });
    }

    try {
        const result = await Master.findByIdAndDelete(masterId);

        if (!result) {
            return res.status(404).json({ message: 'Master not found' });
        }

        res.status(200).json({ message: 'Master deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Получение мастеров по идентификатору услуги
router.get('/by-service/:serviceId', async (req, res) => {
    const { serviceId } = req.params;

    try {
        const masters = await Master.find({ service: serviceId });

        if (masters.length === 0) {
            return res.status(404).json({ message: 'No masters found for this service' });
        }

        res.json(masters);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Получение мастеров по идентификатору страны
router.get('/by-country/:countryId', async (req, res) => {
    const { countryId } = req.params;

    try {
        const masters = await Master.find({ country: countryId });

        if (masters.length === 0) {
            return res.status(404).json({ message: 'No masters found for this country' });
        }

        res.json(masters);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Маршрут для создания нового мастера
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, service, country } = req.body;
        if (!req.file) {
            throw new Error('Image file is required');
        }
        if (!name || !service || !country) {
            throw new Error('Missing required fields');
        }
        const imageUrl = '/uploads/' + req.file.filename;
        const newMaster = new Master({ name, imageUrl, service, country });
        await newMaster.save();
        res.status(201).json(newMaster);
    } catch (error) {
        console.error('Error creating master:', error.message);
        res.status(500).json({ message: 'Error creating master', error: error.message });
    }
});

module.exports = router;
