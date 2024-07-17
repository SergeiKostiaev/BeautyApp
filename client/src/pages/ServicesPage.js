import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, Avatar, Typography, styled, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import logo from "../DevPrime.ru.png";

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
    backgroundColor: selected ? '#252525' : '#D9D9D9',
    borderRadius: '10px', // скругление углов плашки
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    padding: '0',
    width: '100%',
    cursor: 'pointer',
    border: selected ? '2px solid #252525' : 'none',
    overflow: 'hidden', // обрезаем изображение, если оно не помещается
}));

const StyledAvatarBox = styled(Box)(({ theme }) => ({
    width: '137px',
    height: '76px',
    overflow: 'hidden',
    borderRadius: '10px 0 0 10px', // скругление углов слева
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '0', // чтобы аватарка внутри была квадратной
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '0',
    padding: '0',
}));

const FixedButton = styled(Button)(({ theme }) => ({
    position: 'fixed',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 20px)',
    maxWidth: '500px',
    backgroundColor: '#252525', // Добавлено свойство backgroundColor
    color: '#FFFFFF', // Добавлено свойство color
    '&:hover': {
        backgroundColor: '#1f1f1f', // Цвет при наведении
    },
}));

const FooterText = styled(Typography)(({ theme }) => ({
    fontSize: '13px',
    textAlign: 'center',
    position: 'fixed',
    bottom: '5px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    // opacity: 0.5
}));

const ServicesPage = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://31.172.75.47:5000/api/services/');
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    const handleServiceClick = (serviceId) => {
        setSelectedService(serviceId);
    };

    const handleNextClick = () => {
        if (selectedService) {
            navigate(`/masters/${selectedService}`);
        }
    };

    return (
        <div style={{ marginTop: '70px', marginLeft: '20px', marginRight: '20px', paddingBottom: '50px' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontSize: '25px', fontWeight: '600' }}>
                {t('select_service')}
            </Typography>
            <List>
                {services.map((service) => (
                    <StyledListItem
                        key={service._id}
                        onClick={() => handleServiceClick(service._id)}
                        selected={selectedService === service._id}
                    >
                        <StyledAvatarBox>
                            <StyledAvatar src={`http://31.172.75.47:5000${service.imageUrl}`} />
                        </StyledAvatarBox>
                        <StyledListItemText primary={t(`services.${service.name}`)} />
                    </StyledListItem>
                ))}
            </List>
            <FixedButton
                variant="contained"
                color="primary"
                onClick={handleNextClick}
                disabled={!selectedService}
            >
                {t('next')}
            </FixedButton>
            <FooterText variant="body2">
                {/*{t('service_created_devprime')}*/}
                <a href="https://devprime.ru/" target="_blank" rel="noopener noreferrer">
                    <img src={logo} alt="Logo" style={{ width: '80px', height: '12px' }} />
                </a>
                 {/*, 2024*/}
            </FooterText>
        </div>
    );
};

export default ServicesPage;
