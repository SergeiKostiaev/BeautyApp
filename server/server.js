const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const bookingsRouter = require('./routes/bookings');
const timeSlotsRouter = require('./routes/timeSlots');
const mastersRouter = require('./routes/masters'); // Подключение роутера для мастеров
const servicesRouter = require('./routes/services'); // Подключение роутера для услуг
const Service = require('./models/service');
const Master = require('./models/master');
const Booking = require('./models/Booking');
const TimeSlot = require('./models/timeSlot'); // Подключение модели для временных слотов
const schedulesRouter = require('./routes/schedules');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/beauty-booking', { useNewUrlParser: true, useUnifiedTopology: true })
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
app.use('/api/masters', mastersRouter); // Использование роутера для мастеров
app.use('/api/services', servicesRouter); // Использование роутера для услуг
app.use('/api/schedules', schedulesRouter);

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

// Пример обработки /api/schedules/:masterId
app.get('/api/schedules/:masterId', async (req, res) => {
    try {
        const masterId = req.params.masterId;
        const schedule = await Schedule.find({ masterId }); // Пример использования Mongoose
        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Пример обработки /api/timeslots/:masterId
app.get('/api/timeslots/:masterId', async (req, res) => {
    try {
        const masterId = req.params.masterId;
        const timeslots = await Timeslot.find({ masterId }); // Пример использования Mongoose
        res.json(timeslots);
    } catch (error) {
        console.error('Error fetching timeslots:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Маршрут для добавления новой услуги с загрузкой изображения
app.post('/api/services/new', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const newService = new Service({
            name,
            imageUrl
        });
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        console.error('Ошибка при добавлении услуги:', error);
        res.status(500).json({ message: 'Ошибка при добавлении услуги', error });
    }
});

// Маршрут для получения всех услуг (дублирование удалено)
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
        console.error('Ошибка при создании бронирования:', error);
        res.status(500).send(error);
    }
});

// Обработка POST запроса для создания временного слота
app.post('/api/time-slots', async (req, res) => {
    const { startTime, endTime, masterId, serviceId } = req.body;

    try {
        // Проверка наличия всех обязательных полей
        if (!startTime || !endTime || !masterId || !serviceId) {
            return res.status(400).json({ message: 'Отсутствуют обязательные поля' });
        }

        // Дополнительные проверки формата данных (например, временной формат)

        // Поиск мастера по ID
        const master = await Master.findById(masterId);
        if (!master) {
            return res.status(404).json({ message: 'Мастер не найден' });
        }

        // Поиск услуги по ID
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Услуга не найдена' });
        }

        // Создание нового временного слота
        const newTimeSlot = new TimeSlot({ startTime, endTime, masterId });
        await newTimeSlot.save();

        // Добавление временного слота в массив timeslots мастера
        master.timeslots.push(newTimeSlot);
        await master.save();

        res.status(201).json(newTimeSlot);
    } catch (error) {
        console.error('Ошибка при создании временного слота:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
