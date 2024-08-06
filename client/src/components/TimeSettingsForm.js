import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Alert,
    MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const TimeSettingsForm = () => {
    const { t } = useTranslation();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timeSlots, setTimeSlots] = useState([]); // Начальное значение - пустой массив
    const [masters, setMasters] = useState([]);
    const [countries, setCountries] = useState([]);
    const [masterId, setMasterId] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch countries
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://devprimeclients.ru/api/countries');
                setCountries(response.data);
            } catch (error) {
                console.error('Ошибка загрузки стран:', error);
                setError(t('time_settings_form.loading_countries_error'));
            }
        };

        fetchCountries();
    }, [t]);

    // Fetch masters based on selected country
    useEffect(() => {
        const fetchMasters = async () => {
            if (selectedCountry) {
                console.log(`Fetching masters for country: ${selectedCountry}`);
                try {
                    const response = await axios.get('https://devprimeclients.ru/api/masters', {
                        params: { country: selectedCountry }
                    });
                    console.log('Masters response:', response.data);
                    if (response.status === 200) {
                        const data = response.data;
                        if (Array.isArray(data)) {
                            setMasters(data);
                        } else {
                            console.error('Некорректные данные мастеров:', data);
                            setMasters([]);
                        }
                    } else {
                        console.error('Ошибка статуса ответа:', response.status);
                        setMasters([]);
                    }
                } catch (error) {
                    console.error('Ошибка загрузки мастеров:', error);
                    if (error.response && error.response.data) {
                        console.error('Ответ сервера:', error.response.data);
                    }
                    setError(t('time_settings_form.loading_masters_error'));
                }
            } else {
                setMasters([]);
            }
        };

        fetchMasters();
    }, [selectedCountry, t]);

    // Fetch time slots based on master ID and date
    useEffect(() => {
        const fetchTimeSlots = async () => {
            if (masterId && selectedDate) {
                try {
                    console.log(`Fetching time slots for master: ${masterId} and date: ${selectedDate}`);
                    const response = await axios.get(`https://devprimeclients.ru/api/time-slots/master/${masterId}?date=${selectedDate}`);
                    if (response.status === 200) {
                        const data = response.data;
                        if (Array.isArray(data)) {
                            setTimeSlots(data);
                        } else {
                            console.error('Некорректные данные слотов времени:', data);
                            setTimeSlots([]);
                        }
                    } else {
                        console.error('Ошибка статуса ответа:', response.status);
                        setTimeSlots([]);
                    }
                } catch (error) {
                    console.error('Ошибка при получении слотов времени:', error);
                    if (error.response && error.response.data) {
                        console.error('Ответ сервера:', error.response.data);
                    }
                    setError(t('time_settings_form.loading_time_slots_error'));
                }
            } else {
                setTimeSlots([]);
            }
        };

        fetchTimeSlots();
    }, [masterId, selectedDate, t]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

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

        try {
            const response = await axios.post('https://devprimeclients.ru/api/time-slots', requestData);
            const newTimeSlot = response.data;
            setTimeSlots(prevTimeSlots => Array.isArray(prevTimeSlots) ? [...prevTimeSlots, newTimeSlot] : [newTimeSlot]);
            setStartTime('');
            setEndTime('');
            setSuccess(t('time_settings_form.time_slot_added'));
            setError(null);
        } catch (error) {
            console.error('Ошибка создания временного интервала:', error);
            if (error.response && error.response.data) {
                console.error('Сообщение об ошибке сервера:', error.response.data.message);
            }
            setError(t('time_settings_form.create_time_slot_error'));
            setSuccess(null);
        }
    };

    // Handle closing snackbars
    const handleCloseSnackbar = () => {
        setError(null);
        setSuccess(null);
    };

    // Handle master change
    const handleMasterChange = (e) => {
        setMasterId(e.target.value);
        setSelectedDate('');
        setTimeSlots([]);
    };

    // Handle country change
    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        console.log(`Selected country ID: ${countryId}`);
        setSelectedCountry(countryId);
        setMasterId('');
        setSelectedDate('');
        setTimeSlots([]);
    };

    // Handle date change
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                {t('time_settings_form.title')}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    select
                    label={t('time_settings_form.select_country')}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    fullWidth
                    margin="normal"
                    required
                >
                    {countries.map((country) => (
                        <MenuItem key={country._id} value={country._id}>
                            {country.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label={t('time_settings_form.select_master')}
                    value={masterId}
                    onChange={handleMasterChange}
                    fullWidth
                    margin="normal"
                    required
                >
                    {Array.isArray(masters) && masters.map((master) => (
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
                {Array.isArray(timeSlots) && timeSlots.length === 0 ? (
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
