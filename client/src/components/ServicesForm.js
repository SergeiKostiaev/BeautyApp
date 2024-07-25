import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../config.js';

const ServicesForm = () => {
    const [serviceName, setServiceName] = useState('');
    const [serviceImage, setServiceImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setServiceImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous success and error messages
        setError(null);
        setSuccess(false);
        setIsLoading(true);

        // FormData for sending files (image)
        const formData = new FormData();
        formData.append('name', serviceName);
        formData.append('image', serviceImage);

        try {
            const response = await axios.post(`${API_URL}/api/services/new`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Service added successfully:', response.data);
            setSuccess(true);
        } catch (error) {
            console.error('Error adding service:', error);
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Error adding service. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }

        // Clear form fields after submission
        setServiceName('');
        setServiceImage(null);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Add New Service
            </Typography>
            <TextField
                label="Service Name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <input type="file" onChange={handleImageChange} style={{ display: 'block', margin: '20px 0' }} />
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Button type="submit" variant="contained" color="primary">
                    Add Service
                </Button>
            )}
            {error && (
                <Alert severity="error" style={{ marginTop: 20 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" style={{ marginTop: 20 }}>
                    Service added successfully!
                </Alert>
            )}
        </form>
    );
};

export default ServicesForm;
