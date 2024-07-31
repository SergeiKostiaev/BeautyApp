const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

dotenv.config();

// Импорт роутеров и функций
const bookingsRouter = require('./routes/bookings');
const timeSlotsRouter = require('./routes/timeSlots');
const mastersRouter = require('./routes/masters');
const servicesRouter = require('./routes/services');
const schedulesRouter = require('./routes/schedules');
const Service = require('./models/Service');
const Master = require('./models/Master');
const Booking = require('./models/Booking');
const TimeSlot = require('./models/timeSlot');
const sendToTelegram = require('./Telegram');
const cancelBookingById = require('./cancelBookingById');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://31.172.75.47:3000',
    optionsSuccessStatus: 200,
};

// Настройки CORS
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/beauty-booking')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware для обработки статических файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Подключение роутеров
app.use('/api/bookings', bookingsRouter);
app.use('/api/time-slots', timeSlotsRouter);
app.use('/api/masters', mastersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/schedules', schedulesRouter);
app.use(bodyParser.json());

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
        const schedule = await Schedule.find({ masterId }); // Убедитесь, что Schedule импортирован или используется правильно
        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Пример обработки /api/time-slots/:masterId
app.get('/api/time-slots/:masterId', async (req, res) => {
    try {
        const masterId = req.params.masterId;
        const date = req.query.date;
        const timeslots = await TimeSlot.find({ masterId, date });
        res.json(timeslots);
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Маршрут для добавления новой услуги с загрузкой изображения
app.post('/api/services/new', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const newService = new Service({ name, imageUrl });
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        console.error('Ошибка при добавлении услуги:', error);
        res.status(500).json({ message: 'Ошибка при добавлении услуги', error });
    }
});

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

// Маршрут для создания бронирования
app.post('/api/bookings', async (req, res) => {
    const { masterId, customerName, customerPhone, date, time } = req.body;

    try {
        const newBooking = new Booking({ masterId, customerName, customerPhone, date, time });
        await newBooking.save();
        await sendToTelegram(`New booking:\nName: ${customerName}\nPhone: ${customerPhone}\nDate: ${date}\nTime: ${time}`, newBooking._id);
        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Обработка POST запроса для создания временного слота
app.post('/api/time-slots', async (req, res) => {
    try {
        const { startTime, endTime, masterId, date } = req.body;
        const newTimeSlot = new TimeSlot({ startTime, endTime, masterId, date, available: true });
        await newTimeSlot.save();
        res.status(201).json(newTimeSlot);
    } catch (error) {
        console.error('Ошибка при создании временного интервала:', error);
        res.status(500).json({ message: 'Ошибка при создании временного интервала' });
    }
});

// Маршрут для отправки сообщений в Telegram
app.post('/api/send-telegram', async (req, res) => {
    try {
        const { message } = req.body;
        await sendToTelegram(message);
        res.status(200).send('Message sent to Telegram');
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Обработка запросов для отмены бронирования через Telegram
app.post('/api/telegram/webhook', async (req, res) => {
    console.log('Received webhook:', req.body);

    const { callback_query } = req.body;

    if (callback_query && callback_query.data) {
        const parts = callback_query.data.split('_');
        if (parts.length === 2) {
            const action = parts[0]; // 'cancel'
            const bookingId = parts[1]; // Должен быть bookingId

            try {
                if (action === 'cancel') {
                    await cancelBookingById(bookingId);
                    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
                    await fetch(telegramUrl, {
                        method: 'POST',
                        body: JSON.stringify({
                            chat_id: callback_query.message.chat.id,
                            text: `Booking ${bookingId} has been successfully canceled.`,
                        }),
                        headers: { 'Content-Type': 'application/json' },
                    });

                    res.status(200).send('Booking canceled');
                } else {
                    res.status(400).send('Invalid action');
                }
            } catch (error) {
                console.error('Error processing callback query:', error);
                res.status(500).send('Internal server error');
            }
        } else {
            res.status(400).send('Invalid callback data format');
        }
    } else {
        res.status(400).send('Bad request');
    }
});

// Маршрут для удаления мастера
app.delete('/api/masters/:id', async (req, res) => {
    try {
        const masterId = req.params.id;
        if (!masterId) {
            return res.status(400).json({ message: 'Invalid master ID' });
        }

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

// Маршрут для удаления сервиса
app.delete('/api/services/:id', async (req, res) => {
    const serviceId = req.params.id;

    try {
        const result = await Service.findByIdAndDelete(serviceId);
        if (!result) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Определение маршрута для получения временных слотов мастера
app.get('/api/time-slots/master/:masterId', async (req, res) => {
    const { masterId } = req.params;
    const { date } = req.query;

    try {
        const timeSlots = await TimeSlot.find({ masterId, date });
        const bookings = await Booking.find({ masterId, date });

        const updatedTimeSlots = timeSlots.map(slot => {
            const isBooked = bookings.some(booking => booking.time === slot.startTime);
            return {
                ...slot.toObject(),
                available: !isBooked,
            };
        });

        res.json(updatedTimeSlots);
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).send('Server error');
    }
});

// Сервирование статических файлов из папки build
app.use(express.static(path.join(__dirname, '../client/build')));

// Обработка всех остальных запросов
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
