const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
dotenv.config();

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
const createBooking = require('./routes/bookingController');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://31.172.75.47:3000',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beauty-booking')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/bookings', bookingsRouter);
app.use('/api/time-slots', timeSlotsRouter);
app.use('/api/masters', mastersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/schedules', schedulesRouter);
app.use(bodyParser.json());

const telegramToken = process.env.TELEGRAM_TOKEN || '7130422316:AAFt7OXkbmV0_ObdPOiGs6v44bXhQCGAAPY';
const telegramUrl = `https://api.telegram.org/bot${telegramToken}`;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.get('/api/schedules/:masterId', async (req, res) => {
    try {
        const masterId = req.params.masterId;
        const schedule = await Schedule.find({ masterId });
        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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

app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/services/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        res.json(service);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/bookings', async (req, res) => {
    const { masterId, customerName, customerPhone, date, time } = req.body;
    try {
        const newBooking = new Booking({ masterId, customerName, customerPhone, date, time });
        await newBooking.save();

        console.log('Booking created with ID:', newBooking._id);

        // Передача ID в функцию отправки сообщения
        await sendToTelegram(`New booking:\nName: ${customerName}\nPhone: ${customerPhone}\nDate: ${date}\nTime: ${time}`, newBooking._id.toString());

        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

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

app.post('/api/send-telegram', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).send('Message is required');
        }

        await sendToTelegram(message);
        res.status(200).send('Message sent to Telegram');
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/webhook', async (req, res) => {
    const update = req.body;

    if (update.callback_query && update.callback_query.data) {
        const callbackData = update.callback_query.data;
        const [action, bookingId] = callbackData.split('_'); // Извлечение action и bookingId

        if (action !== 'cancel' || !mongoose.Types.ObjectId.isValid(bookingId)) {
            console.error('Invalid action or bookingId:', { action, bookingId });
            res.status(400).send('Invalid request');
            return;
        }

        try {
            console.log('Canceling booking with ID:', bookingId);
            const booking = await cancelBookingById(bookingId);

            // Отправка ответа в Telegram
            await fetch(`${telegramUrl}/answerCallbackQuery`, {
                method: 'POST',
                body: JSON.stringify({
                    callback_query_id: update.callback_query.id,
                    text: 'Booking canceled successfully',
                    show_alert: false
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            res.status(200).send('Booking canceled and response sent to Telegram');
        } catch (error) {
            console.error('Error processing callback query:', error);
            res.status(500).send('Error processing request');
        }
    } else {
        res.status(400).send('Not a callback query');
    }
});


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

app.post(`/api/telegram/${process.env.TELEGRAM_TOKEN}`, async (req, res) => {
    const { callback_query } = req.body;

    if (callback_query && callback_query.data) {
        const bookingId = callback_query.data.split('_')[1];

        try {
            await cancelBookingById(bookingId);
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                body: JSON.stringify({
                    chat_id: callback_query.message.chat.id,
                    text: `Booking ${bookingId} has been successfully canceled.`,
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            res.status(200).send('Booking canceled');
        } catch (error) {
            console.error('Error processing callback query:', error);
            res.status(500).send('Internal server error');
        }
    } else {
        res.status(400).send('Bad request');
    }
});

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

app.post('/bookings', createBooking);

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
