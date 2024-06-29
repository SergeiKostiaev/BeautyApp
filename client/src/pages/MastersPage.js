import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const MastersPage = () => {
    const { serviceId } = useParams();
    const [masters, setMasters] = useState([]);
    const [serviceName, setServiceName] = useState('');

    useEffect(() => {
        const fetchMasters = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/masters');
                setMasters(response.data);
            } catch (error) {
                console.error('Error fetching masters:', error);
            }
        };

        const fetchServiceName = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/services/${serviceId}`);
                setServiceName(response.data.name);
            } catch (error) {
                console.error('Error fetching service:', error);
            }
        };

        fetchMasters();
        fetchServiceName();
    }, [serviceId]);

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Выберите мастера для {serviceName}
            </Typography>
            <List>
                {masters.map(master => (
                    <ListItem key={master._id} button component={Link} to={`/booking/${master._id}`}>
                        <ListItemText primary={master.name} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default MastersPage;
