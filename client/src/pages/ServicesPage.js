import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';

const ServicesPage = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/services/');
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Choose a Service
            </Typography>
            <List>
                {services.map((service) => (
                    <ListItem key={service._id} component={Link} to={`/masters/${service._id}`}>
                        <ListItemAvatar>
                            <Avatar src={service.imageUrl} />
                        </ListItemAvatar>
                        <ListItemText primary={service.name} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ServicesPage;
