import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Container, Typography, Alert } from '@mui/material';
import axios from 'axios';
// import { API_URL } from '../config.js';

const MastersForm = () => {
    const [masterName, setMasterName] = useState('');
    const [masterImage, setMasterImage] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [error, setError] = useState(null); // Состояние для ошибки
    const [success, setSuccess] = useState(null); // Состояние для успешного создания

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`https://devprimeclients.ru/api/services`);
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
                setError('Ошибка при загрузке услуг');
            }
        };

        fetchServices();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setMasterImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', masterName);
        formData.append('image', masterImage);
        formData.append('service', selectedService);

        try {
            const response = await axios.post(`https://devprimeclients.ru/api/masters`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Мастер успешно создан:', response.data);
            setSuccess('Мастер успешно создан!'); // Сообщение об успешном создании
            setError(null); // Очистите ошибку
            setMasterName(''); // Очистите форму
            setMasterImage(null);
            setSelectedService('');
        } catch (error) {
            console.error('Ошибка при создании мастера:', error);
            setError(`Ошибка при создании мастера: ${error.response ? error.response.data.message : error.message}`); // Сообщение об ошибке
            setSuccess(null); // Очистите сообщение об успехе
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Добавить мастера
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Имя мастера"
                    value={masterName}
                    onChange={(e) => setMasterName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <input type="file" onChange={handleImageChange} required />
                <TextField
                    select
                    label="Услуга"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                >
                    {services.map((service) => (
                        <MenuItem key={service._id} value={service._id}>
                            {service.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Button type="submit" variant="contained" color="primary">
                    Добавить мастера
                </Button>
                {error && (
                    <Alert severity="error" style={{ marginTop: 20 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" style={{ marginTop: 20 }}>
                        {success}
                    </Alert>
                )}
            </form>
        </Container>
    );
};

export default MastersForm;
