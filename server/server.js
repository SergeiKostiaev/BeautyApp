const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
const loginRouter = require('./routes/auth');
dotenv.config();

const bookingsRouter = require('./routes/bookings');
const timeSlotsRouter = require('./routes/timeSlots');
const mastersRouter = require('./routes/masters');
const serviceRouter = require('./routes/services');
const schedulesRouter = require('./routes/schedules');
const countriesRouter = require('./routes/country');
const sendToTelegram = require('./Telegram');
const { cancelBookingById } = require('./cancelBookingById');

const Country = require('./models/country');
const Service = require('./models/Service');
const Master = require('./models/Master');
const Booking = require('./models/Booking');
const TimeSlot = require('./models/timeSlot');


const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: 'https://devprimeclients.ru', // Замените на ваш фронтенд домен
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/beauty-booking';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware для обработки статических файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer настройка
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
// Маршруты
app.use('/api/bookings', bookingsRouter);
app.use('/api/timeslots', timeSlotsRouter);
app.use('/api/masters', mastersRouter);
app.use('/api/services', serviceRouter);
app.use('/api/countries', countriesRouter);
app.use('/api', loginRouter);

app.put('/api/time-slots/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSlot = await TimeSlot.findByIdAndUpdate(id, { booked: true }, { new: true });
        res.json(updatedSlot);
    } catch (error) {
        console.error('Error updating time slot:', error);
        res.status(500).send('Server error');
    }
});

// Маршрут для добавления новой услуги с загрузкой изображения
app.post('/api/services/new', upload.single('image'), async (req, res) => {
    try {
        const { name, country, cost } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const newService = new Service({ name, imageUrl, country, cost });
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        console.error('Ошибка при добавлении услуги:', error);
        res.status(500).json({ message: 'Ошибка при добавлении услуги', error });
    }
});

// Маршрут для получения всех услуг
app.get('/api/services', async (req, res) => {
    const { country } = req.query;
    try {
        const query = country ? { country } : {};
        const services = await Service.find(query);
        res.json(services);
    } catch (error) {
        console.error('Ошибка при получении услуг:', error);
        res.status(500).json({ message: 'Ошибка при получении услуг' });
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

// Пример обработки /api/schedules/:masterId
app.get('/api/schedules/:masterId', async (req, res) => {
    try {
        const masterId = req.params.masterId;
        const schedule = await Schedule.find({ masterId });
        res.json(schedule);
    } catch (error) {
        console.error('Ошибка при получении расписания:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Пример обработки /api/time-slots/:masterId
app.get('/api/time-slots/master/:masterId', async (req, res) => {
    try {
        const { masterId } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        const timeSlots = await TimeSlot.find({ masterId, date });
        res.json(timeSlots); // Убедитесь, что данные возвращаются в формате JSON
    } catch (error) {
        console.error('Ошибка при получении временных слотов:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Маршрут для создания бронирования
app.post('/api/bookings', async (req, res) => {
    const { masterId, customerName, customerPhone, date, time } = req.body;

    try {
        const newBooking = new Booking({ masterId, customerName, customerPhone, date, time });
        await newBooking.save();

        // Отправка уведомления в Telegram с кнопкой отмены
        await sendToTelegram(`New booking:\nName: ${customerName}\nPhone: ${customerPhone}\nDate: ${date}\nTime: ${time}`, newBooking._id);

        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Ошибка при создании бронирования:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Обработка POST запроса для создания временного слота
app.post('/api/time-slots', async (req, res) => {
    try {
        const { startTime, endTime, masterId, date } = req.body;
        const newTimeSlot = new TimeSlot({
            startTime,
            endTime,
            masterId,
            date,
            available: true,
        });

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
        const { message, bookingId } = req.body; // Убедитесь, что bookingId передается в запросе
        if (!bookingId) {
            return res.status(400).send('Missing bookingId');
        }
        await sendToTelegram(message, bookingId);
        res.status(200).send('Message sent to Telegram');
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Telegram:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Обработка webhook от Telegram
// app.post('/api/telegram/webhook', async (req, res) => {
//     console.log('Received webhook:', req.body);
//
//     const { callback_query } = req.body;
//
//     if (callback_query) {
//         const { data, message } = callback_query;
//
//         console.log('Received callback query:', callback_query);
//
//         if (data && data.startsWith('cancel_')) {
//             const bookingId = data.split('_')[1];
//             console.log('Extracted bookingId:', bookingId);
//
//             try {
//                 await cancelBookingById(bookingId);
//                 // Отправьте подтверждение в Telegram, если нужно
//                 res.send('OK');
//             } catch (error) {
//                 console.error('Ошибка при отмене бронирования или отправке сообщения:', error);
//                 res.status(500).send('Internal Server Error');
//             }
//         } else {
//             console.log('Invalid callback query data');
//             res.send('Invalid request');
//         }
//     } else {
//         console.log('No callback_query received');
//         res.send('No callback query');
//     }
// });
app.post('/api/telegram/webhook', async (req, res) => {
    try {
        const bookingId = extractBookingIdFromRequest(req); // Определите функцию extractBookingIdFromRequest
        await cancelBookingById(bookingId);
        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при отмене бронирования или отправке сообщения:', error);
        res.sendStatus(500);
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
        console.error('Ошибка при удалении мастера:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Эндпоинт для получения мастеров
app.get('/api/masters', async (req, res) => {
    try {
        const { country } = req.query;
        console.log('Полученный параметр country:', country);

        const query = country ? { country } : {};
        const masters = await Master.find(query);

        console.log('Найденные мастера:', masters);
        res.json(masters);
    } catch (error) {
        console.error('Ошибка при загрузке мастеров:', error);
        res.status(500).json({ message: 'Ошибка при загрузке мастеров' });
    }
});

// Маршрут для получения мастеров по стране
app.get('/api/masters/by-country/:countryId', async (req, res) => {
    try {
        const { countryId } = req.params;
        const masters = await Master.find({ country: countryId });

        if (masters.length === 0) {
            return res.status(404).json({ message: 'No masters found for this country' });
        }

        res.json(masters);
    } catch (error) {
        console.error('Error fetching masters by country:', error);
        res.status(500).json
        ({ message: 'Internal Server Error' });
    }
});

// Создайте нового мастера и сохраните его в базе данных
app.post('/api/masters', upload.single('image'), async (req, res) => {
    const { name, service, country } = req.body;

    try {
        // Проверьте, существуют ли указанные идентификаторы
        const validService = await Service.findById(service);
        const validCountry = await Country.findById(country);

        if (!validService || !validCountry) {
            return res.status(400).json({ message: 'Invalid service or country ID' });
        }

        // Сохраните изображение и создайте URL
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        // Создайте нового мастера
        const newMaster = new Master({
            name,
            imageUrl,
            service,
            country
        });

        // Сохраните мастера в базе данных
        const savedMaster = await newMaster.save();

        // Отправьте ответ
        res.status(201).json(savedMaster);
    } catch (error) {
        console.error('Error creating master:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Раздача статических файлов для фронтенда
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
