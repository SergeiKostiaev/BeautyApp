import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Container, Typography } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../config.js';

const MastersForm = () => {
    const [masterName, setMasterName] = useState('');
    const [masterImage, setMasterImage] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`http://31.172.75.47:5000/api/services`);
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
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
            const response = await axios.post(`http://31.172.75.47:5000/api/masters`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Мастер успешно создан:', response.data);
        } catch (error) {
            console.error('Ошибка при создании мастера:', error);
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
            </form>
        </Container>
    );
};

export default MastersForm;