import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, Avatar, Typography, styled, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import logo from "../DevPrime.ru.png";

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
    backgroundColor: selected ? '#252525' : '#D9D9D9',
    borderRadius: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    padding: '0',
    width: '100%',
    cursor: 'pointer',
    border: selected ? '2px solid #252525' : 'none',
    overflow: 'hidden',
}));

const StyledAvatarBox = styled(Box)(({ theme }) => ({
    width: '137px',
    height: '76px',
    overflow: 'hidden',
    borderRadius: '10px 0 0 10px',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '0',
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
    bottom: '20px', // Поднял чуть выше для видимости на экране
    left: '0',
    width: '100%', // Устанавливает ширину на всю ширину экрана
    padding: '20px', // Увеличивает размер кнопки
    fontSize: '18px', // Делает текст крупнее
    maxWidth: '100%', // Устанавливает максимальную ширину на 100%
    backgroundColor: '#252525',
    color: '#FFFFFF',
    '&:hover': {
        backgroundColor: '#7b1fa2',
    },
}));


const ServicesPage = ({ selectedCountry }) => {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('https://devprimeclients.ru/api/services', {
                    params: selectedCountry ? { country: selectedCountry } : {}
                });
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, [selectedCountry]);

    const handleServiceClick = (serviceId) => {
        setSelectedService(serviceId);
    };

    const handleNextClick = () => {
        if (selectedService) {
            navigate(`/masters/${selectedService}`);
        }
    };

    return (
        <div style={{ marginTop: '80px', marginLeft: '20px', marginRight: '20px', paddingBottom: '50px' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontSize: '25px', fontWeight: '600' }}>
                {t('select_service')}
            </Typography>

            <List>
                {Array.isArray(services) && services.map((service) => (
                    <StyledListItem
                        key={service._id}
                        onClick={() => handleServiceClick(service._id)}
                        selected={selectedService === service._id}
                    >
                        <StyledAvatarBox>
                            <StyledAvatar src={`https://devprimeclients.ru${service.imageUrl}`} />
                        </StyledAvatarBox>
                        <StyledListItemText
                            primary={`${t(`services.${service.name}`)} - $${service.cost}`}
                        />
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

        </div>
    );
};

export default ServicesPage;
