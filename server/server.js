const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const bookingsRouter = require('./routes/bookings');
const timeSlotsRouter = require('./routes/timeSlots');
const Service = require('./models/service');  // Убедитесь, что путь правильный
const Master = require('./models/master');
const Booking = require('./models/booking');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/beauty-booking')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Middleware для обработки статических файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Маршруты
app.use('/api/bookings', bookingsRouter);
app.use('/api/time-slots', timeSlotsRouter);

// Маршрут для получения всех услуг
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Маршрут для получения услуги по ID
app.get('/api/services/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        res.json(service);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Маршрут для получения всех мастеров
app.get('/api/masters', async (req, res) => {
    try {
        const masters = await Master.find();
        res.json(masters);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Маршрут для создания бронирования
app.post('/api/bookings', async (req, res) => {
    try {
        const { masterId, serviceId, date, time, customerName, customerPhone } = req.body;
        const booking = new Booking({
            masterId,
            serviceId,
            date,
            time,
            customerName,
            customerPhone
        });
        await booking.save();
        res.status(201).send(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).send(error);
    }
});

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

// Маршрут для добавления новой услуги с загрузкой изображения
// Маршрут для добавления новой услуги с загрузкой изображения
app.post('/api/services/new', upload.single('image'), async (req, res) => {
    try {
        console.log('Получен запрос на добавление новой услуги');
        const { name } = req.body;
        console.log('Имя услуги:', name);

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        console.log('URL изображения:', imageUrl);

        const newService = new Service({
            name,
            imageUrl
        });

        const savedService = await newService.save();
        console.log('Услуга успешно сохранена:', savedService);

        res.status(201).json(savedService);
    } catch (error) {
        console.error('Ошибка при добавлении услуги:', error);
        res.status(500).json({ message: 'Ошибка при добавлении услуги', error });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
