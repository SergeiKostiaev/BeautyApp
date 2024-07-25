import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, Snackbar, Alert, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../config.js';

const TimeSettingsForm = () => {
    const { t } = useTranslation();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [masters, setMasters] = useState([]);
    const [masterId, setMasterId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchMasters();
    }, []);

    const fetchMasters = async () => {
        try {
            const response = await axios.get(`http://31.172.75.47:5000/api/masters`);
            setMasters(response.data);
        } catch (error) {
            console.error('Ошибка загрузки мастеров:', error);
            setError(t('time_settings_form.loading_masters_error'));
        }
    };

    const fetchTimeSlots = async (masterId, date) => {
        try {
            const response = await axios.get(`http://31.172.75.47:5000/api/time-slots/master/${masterId}?date=${date}`);
            setTimeSlots(response.data);
        } catch (error) {
            console.error('Ошибка при получении слотов времени:', error);
            setError(t('time_settings_form.loading_time_slots_error'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация на клиенте
        if (!startTime || !endTime || !masterId || !selectedDate) {
            setError('Все поля обязательны для заполнения.');
            return;
        }

        const requestData = {
            startTime,
            endTime,
            masterId,
            date: selectedDate
        };

        console.log('Данные, отправляемые на сервер:', requestData);

        try {
            const response = await axios.post(`http://31.172.75.47:5000/api/time-slots`, requestData);
            const newTimeSlot = response.data;
            setTimeSlots(prevTimeSlots => [...prevTimeSlots, newTimeSlot]);
            setStartTime('');
            setEndTime('');
            setSuccess(t('time_settings_form.time_slot_added'));
            setError(null);
        } catch (error) {
            console.error('Ошибка создания временного интервала:', error);
            if (error.response) {
                console.error('Сообщение об ошибке сервера:', error.response.data.message);
            }
            setError(t('time_settings_form.create_time_slot_error'));
            setSuccess(null);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setSuccess(null);
    };

    const handleMasterChange = (e) => {
        const selectedMasterId = e.target.value;
        setMasterId(selectedMasterId);
        setSelectedDate(''); // Сбрасываем выбранную дату при изменении мастера
        setTimeSlots([]); // Очищаем текущие временные интервалы
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    useEffect(() => {
        if (masterId && selectedDate) {
            fetchTimeSlots(masterId, selectedDate);
        } else {
            setTimeSlots([]); // Очищаем временные интервалы, если мастер или дата не выбраны
        }
    }, [masterId, selectedDate]);

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                {t('time_settings_form.title')}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    select
                    label={t('time_settings_form.select_master')}
                    value={masterId}
                    onChange={handleMasterChange}
                    fullWidth
                    margin="normal"
                    required
                >
                    {masters.map((master) => (
                        <MenuItem key={master._id} value={master._id}>
                            {master.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label={t('time_settings_form.select_date')}
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />
                <TextField
                    label={t('time_settings_form.start_time')}
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300,
                    }}
                    required
                />
                <TextField
                    label={t('time_settings_form.end_time')}
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300,
                    }}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {t('time_settings_form.add_interval')}
                </Button>
            </form>
            <List>
                {timeSlots.length === 0 ? (
                    <ListItem>
                        <ListItemText primary={t('time_settings_form.no_time_slots')} />
                    </ListItem>
                ) : (
                    timeSlots.map((slot) => (
                        <ListItem key={slot._id}>
                            <ListItemText primary={`${slot.startTime} - ${slot.endTime}`} />
                        </ListItem>
                    ))
                )}
            </List>
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TimeSettingsForm;
