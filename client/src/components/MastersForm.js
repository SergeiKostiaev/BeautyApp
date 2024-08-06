import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Container, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MastersForm = () => {
    const { t } = useTranslation();
    const [masterName, setMasterName] = useState('');
    const [masterImage, setMasterImage] = useState(null);
    const [services, setServices] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            if (selectedCountry) {
                try {
                    const response = await axios.get('https://devprimeclients.ru/api/services', {
                        params: { country: selectedCountry } // Sending the country name
                    });
                    setServices(response.data);
                } catch (error) {
                    setError(t('fetchServicesError')); // Use translation
                    console.error('Error fetching services:', error);
                }
            } else {
                setServices([]);
            }
        };
        fetchServices();
    }, [selectedCountry, t]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://devprimeclients.ru/api/countries');
                if (Array.isArray(response.data)) {
                    setCountries(response.data);
                } else {
                    setError(t('dataFormatError')); // Use translation
                }
            } catch (error) {
                setError(t('fetchCountriesError')); // Use translation
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, [t]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setMasterImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', masterName);
        formData.append('image', masterImage);
        formData.append('service', selectedService); // Ensure this is the service ID
        formData.append('country', selectedCountry); // Ensure this is the country ID

        try {
            const response = await axios.post('https://devprimeclients.ru/api/masters', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess(t('masterCreatedSuccess')); // Use translation
            setError(null);
            setMasterName('');
            setMasterImage(null);
            setSelectedService('');
            setSelectedCountry('');
        } catch (error) {
            setError(`${t('masterCreationError')}: ${error.response ? error.response.data.message : error.message}`); // Use translation
            setSuccess(null);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {t('addMaster')} {/* Use translation */}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label={t('masterName')}
                    value={masterName}
                    onChange={(e) => setMasterName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <input type="file" onChange={handleImageChange} required />
                <TextField
                    select
                    label={t('country')}
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                >
                    {countries.length > 0 ? (
                        countries.map((country) => (
                            <MenuItem key={country._id} value={country._id}>
                                {country.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>{t('noCountriesAvailable')}</MenuItem>
                    )}
                </TextField>
                <TextField
                    select
                    label={t('service')}
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                >
                    {services.length > 0 ? (
                        services.map((service) => (
                            <MenuItem key={service._id} value={service._id}>
                                {service.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>{t('noServicesAvailable')}</MenuItem>
                    )}
                </TextField>
                <Button type="submit" variant="contained" color="primary">
                    {t('addMasterButton')} {/* Use translation */}
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
