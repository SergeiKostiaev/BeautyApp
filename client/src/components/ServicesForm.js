import React, { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, Typography, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API_URL = 'https://devprimeclients.ru';  // Исправьте URL вашего API

const ServicesForm = () => {
    const { t } = useTranslation();
    const [serviceName, setServiceName] = useState('');
    const [serviceImage, setServiceImage] = useState(null);
    const [country, setCountry] = useState('');
    const [cost, setCost] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/countries`);  // Исправьте URL для получения стран
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
                setError('Error fetching countries. Please try again.');
            }
        };

        fetchCountries();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setServiceImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);
        setSuccess(false);
        setIsLoading(true);

        if (!serviceName || !serviceImage || !country || !cost) {
            setError('All fields are required.');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', serviceName);
        formData.append('image', serviceImage);
        formData.append('country', country);
        formData.append('cost', cost);

        try {
            const response = await axios.post(`${API_URL}/api/services/new`, formData, {  // Исправьте URL для добавления услуги
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Service added successfully:', response.data);
            setSuccess(true);
        } catch (error) {
            console.error('Error adding service:', error);
            setError(error.response?.data?.message || 'Error adding service. Please try again.');
        } finally {
            setIsLoading(false);
        }

        setServiceName('');
        setServiceImage(null);
        setCountry('');
        setCost('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                {t('addService')}
            </Typography>
            <TextField
                label={t("serviceName")}
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <input type="file" onChange={handleImageChange} style={{ display: 'block', margin: '20px 0' }} />
            <FormControl fullWidth margin="normal" required>
                <InputLabel>{t('country')}</InputLabel>
                <Select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    label="Country"
                >
                    {countries.map((country) => (
                        <MenuItem key={country._id} value={country._id}>
                            {country.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label={t('cost')}
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Button type="submit" variant="contained" color="primary">
                    {t('addService')}
                </Button>
            )}
            {error && (
                <Alert severity="error" style={{ marginTop: 20 }}>
                    {t('errorFetchingCountries')}
                </Alert>
            )}
            {success && (
                <Alert severity="success" style={{ marginTop: 20 }}>
                    {t('serviceAddedSuccessfully')}
                </Alert>
            )}
        </form>
    );
};

export default ServicesForm;
