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
const upload = multer({ storage: storage });

// Создание нового мастера
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, service } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const newMaster = new Master({
            name,
            imageUrl,
            service // Убедитесь, что service корректно установлен при создании мастера
        });
        const savedMaster = await newMaster.save();
        res.status(201).json(savedMaster);
    } catch (error) {
        console.error('Ошибка при создании мастера:', error);
        res.status(500).json({ message: 'Ошибка при создании мастера', error });
    }
});

// Получение всех мастеров
router.get('/', async (req, res) => {
    try {
        const masters = await Master.find().populate('service');
        res.json(masters);
    } catch (err) {
        console.error('Ошибка при получении мастеров:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Обновление мастера
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, imageUrl, service } = req.body;

        const updatedMaster = await Master.findByIdAndUpdate(id, {
            name,
            imageUrl,
            service // Убедитесь, что service корректно установлен при обновлении мастера
        }, { new: true });

        if (!updatedMaster) {
            return res.status(404).json({ message: 'Мастер не найден' });
        }

        res.json(updatedMaster);
    } catch (err) {
        console.error('Ошибка при обновлении мастера:', err);
        res.status(400).json({ message: err.message });
    }
});

// Удаление мастера
// Удаление мастера
router.delete('/masters/:id', async (req, res) => {
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
        console.error('Error deleting master:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Получение мастеров по конкретной услуге
router.get('/by-service/:serviceId', async (req, res) => {
    const { serviceId } = req.params;

    try {
        const masters = await Master.find({ service: serviceId }).populate('service');
        res.json(masters);
    } catch (error) {
        console.error('Ошибка при получении мастеров по услуге:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});


module.exports = router;
