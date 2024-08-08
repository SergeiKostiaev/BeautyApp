import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Button, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

const StyledListItem = styled(ListItem)(({ theme }) => ({
    backgroundColor: '#D9D9D9',
    borderRadius: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textDecoration: 'none',
    padding: '10px',
    '&:hover': {
        backgroundColor: '#252525',
        color: '#FFFFFF',
    },
}));

const DeleteServiceForm = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch('https://devprimeclients.ru/api/services')
            .then(response => response.json())
            .then(data => setServices(data))
            .catch(error => console.error('Error fetching services:', error));
    }, []);

    const handleDelete = (serviceId) => {
        console.log(`Attempting to delete service with ID: ${serviceId}`);

        // Проверка наличия сервиса перед удалением
        const serviceToDelete = services.find(service => service._id === serviceId);
        if (!serviceToDelete) {
            alert('Service not found!');
            return;
        }

        fetch(`https://devprimeclients.ru/api/services/${serviceId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                console.log('Service deleted successfully');
                setServices(services.filter(service => service._id !== serviceId));
            })
            .catch(error => {
                console.error('There was an error deleting the service!', error);
                alert(`Error deleting service: ${error.message}`);
            });
    };

    return (
        <Box>
            <Typography variant="h6" component="h2" gutterBottom>
                {t('deleteService')}
            </Typography>
            <List>
                {services.map(service => (
                    <StyledListItem key={service._id} component="li">
                        <Typography>{service.name}</Typography>
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(service._id)}>
                            {t('delete')}
                        </Button>
                    </StyledListItem>
                ))}
            </List>
        </Box>
    );
};

export default DeleteServiceForm;
