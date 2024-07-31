import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Button, styled } from '@mui/material';
import axios from 'axios';
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
        axios.get('https://devprimeclients.ru/api/services')
            .then(response => setServices(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleDelete = (serviceId) => {
        console.log(`Attempting to delete service with ID: ${serviceId}`);

        axios.delete(`https://devprimeclients.ru/api/services/${serviceId}`)
            .then(() => {
                console.log('Service deleted successfully');
                setServices(services.filter(service => service._id !== serviceId));
            })
            .catch(error => {
                console.error('There was an error deleting the service!', error);
                alert(`Error deleting service: ${error.response ? error.response.data.message : error.message}`);
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
