import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';

const BookingPage = () => {
    const { serviceId } = useParams(); // Получаем serviceId из URL
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        // Загрузка доступных временных интервалов с сервера
        const fetchTimeSlots = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/time-slots');
                setTimeSlots(response.data);
            } catch (error) {
                console.error('Error fetching time slots:', error);
            }
        };

        fetchTimeSlots();
    }, []);

    // Функция для проверки формата ObjectId
    function isValidObjectId(id) {
        return /^[0-9a-fA-F]{24}$/.test(id);
    }

    // Функция для создания бронирования
    const createBooking = async (e) => {
        e.preventDefault(); // Предотвращаем стандартное поведение отправки формы

        // Проверяем, что serviceId не пустой и валидный ObjectId
        if (!serviceId || !isValidObjectId(serviceId)) {
            console.error('Invalid or empty serviceId:', serviceId);
            return;
        }

        const bookingData = {
            serviceId: serviceId,
            customerName: customerName,
            customerPhone: customerPhone,
            date: date,
            time: time
            // Добавьте другие данные для бронирования по необходимости
        };

        try {
            const response = await axios.post('http://localhost:5000/api/bookings', bookingData);
            console.log('Booking created:', response.data);
            // Устанавливаем флаг успешного бронирования
            setBookingSuccess(true);
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    };

    // Если бронирование успешно, переходим на страницу SuccessPage
    if (bookingSuccess) {
        return <Navigate to="/success" />;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Запись к мастеру
            </Typography>
            <form onSubmit={createBooking}>
                <TextField
                    label="Имя клиента"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Телефон клиента"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Дата"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />
                <TextField
                    label="Время"
                    select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                >
                    {timeSlots.map((slot) => (
                        <MenuItem key={slot._id} value={slot.startTime}>
                            {slot.startTime} - {slot.endTime}
                        </MenuItem>
                    ))}
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Записаться
                </Button>
            </form>
        </Container>
    );
};

export default BookingPage;
