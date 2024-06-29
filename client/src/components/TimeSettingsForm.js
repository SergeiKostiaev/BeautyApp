import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, Snackbar, Alert, MenuItem } from '@mui/material';

const TimeSettingsForm = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [masters, setMasters] = useState([]); // Список мастеров
    const [masterId, setMasterId] = useState(''); // Текущий ID мастера
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchMasters(); // Загрузить мастеров при монтировании компонента
    }, []);

    useEffect(() => {
        if (masterId) {
            fetchTimeSlots();
        }
    }, [masterId]);

    const fetchMasters = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/masters');
            setMasters(response.data);
        } catch (error) {
            console.error('Error fetching masters:', error);
            setError('Ошибка загрузки мастеров');
        }
    };

    const fetchTimeSlots = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/time-slots/${masterId}`);
            console.log('Fetched time slots:', response.data);
            setTimeSlots(response.data);
        } catch (error) {
            console.error('Error fetching time slots:', error);
            setError('Ошибка загрузки временных интервалов');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/time-slots', {
                startTime,
                endTime,
                masterId // Include master ID
            });
            setTimeSlots([...timeSlots, response.data]);
            setStartTime('');
            setEndTime('');
            setSuccess('Интервал успешно добавлен');
            setError(null); // Clear any existing errors
        } catch (error) {
            console.error('Error creating time slot:', error);
            setError('Ошибка создания временного интервала');
            setSuccess(null); // Clear success message on error
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setSuccess(null);
    };

//     const addTimeSlot = async (startTime, endTime) => {
//         try {
//             const response = await axios.post('http://localhost:5000/api/time-slots', { startTime, endTime });
//             return response.data;
//         } catch (error) {
//             console.error('Ошибка при добавлении временного интервала:', error);
//             throw error;
//         }
//     };
//
// // Пример вызова функции для добавления временного интервала
//     addTimeSlot('2024-06-27T10:00:00', '2024-06-27T11:00:00')
//         .then(data => console.log('Добавлен временной интервал:', data))
//         .catch(error => console.error('Ошибка:', error));

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Настройка Временных Интервалов
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    select
                    label="Выберите мастера"
                    value={masterId}
                    onChange={(e) => setMasterId(e.target.value)}
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
                    label="Начало"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 minutes interval
                    }}
                    required
                />
                <TextField
                    label="Конец"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 minutes interval
                    }}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Добавить интервал
                </Button>
            </form>
            <List>
                {timeSlots.map((slot) => (
                    <ListItem key={slot._id}>
                        <ListItemText primary={`${slot.startTime} - ${slot.endTime}`} />
                    </ListItem>
                ))}
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
