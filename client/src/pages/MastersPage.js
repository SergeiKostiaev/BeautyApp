import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, List, ListItem, Avatar, styled, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import logo from "../DevPrime.ru.png";

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
    backgroundColor: '#D9D9D9',
    borderRadius: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    padding: '0',
    width: '100%',
    border: selected ? '2px solid #252525' : 'none',
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

const FixedButtonContainer = styled(Box)(({ theme }) => ({
    position: 'fixed',
    left: '0',
    bottom: '30px',
    width: '100%',
    padding: '10px 0', // убираем боковые отступы для кнопок на всю ширину
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
}));

const FixedButton = styled(Button)(({ theme }) => ({
    width: '100%',
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
    backgroundColor: '#252525',
    color: '#FFFFFF',
    '&:hover': {
        backgroundColor: '#7b1fa2',
    }
}));

const FixedOutlinedButton = styled(Button)(({ theme }) => ({
    width: '100%',
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
    borderColor: '#252525',
    color: '#252525',
    '&:hover': {
        borderColor: '#7b1fa2',
        color: '#7b1fa2',
    },
}));


const MastersPage = () => {
    const { t } = useTranslation();
    const { serviceId } = useParams();
    const [masters, setMasters] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [selectedMaster, setSelectedMaster] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMasters = async () => {
            try {
                const response = await axios.get(`https://devprimeclients.ru/api/masters/by-service/${serviceId}`);
                setMasters(response.data);
            } catch (error) {
                console.error('Error fetching masters:', error);
            }
        };

        const fetchServiceName = async () => {
            try {
                const response = await axios.get(`https://devprimeclients.ru/api/services/${serviceId}`);
                setServiceName(response.data.name);
            } catch (error) {
                console.error('Error fetching service:', error);
            }
        };

        const loadData = async () => {
            await fetchServiceName();
            await fetchMasters();
        };

        loadData();
    }, [serviceId]);

    const handleMasterSelect = (masterId) => {
        setSelectedMaster(masterId);
    };

    const handleNextClick = () => {
        if (selectedMaster) {
            navigate(`/booking/${selectedMaster}`);
        }
    };

    return (
        <Box px={2} py={2} style={{ marginTop: '70px' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: '25px', fontWeight: '600', textAlign: 'center' }}>
                {t('masters_page.select_master', { serviceName: serviceName })}
            </Typography>
            <List>
                {masters.map(master => (
                    <StyledListItem
                        key={master._id}
                        onClick={() => handleMasterSelect(master._id)}
                        selected={selectedMaster === master._id}
                    >
                        <StyledAvatarBox>
                            <StyledAvatar src={`https://devprimeclients.ru${master.imageUrl}`} />
                        </StyledAvatarBox>
                        <Typography sx={{ flex: 1, ml: 2 }}>
                            {master.name}
                        </Typography>
                    </StyledListItem>
                ))}
            </List>
            <FixedButtonContainer>
                <FixedButton variant="contained" color="primary" onClick={handleNextClick} disabled={!selectedMaster}>
                    {t('next')}
                </FixedButton>
                <FixedOutlinedButton component={Link} to="/" variant="outlined" color="primary">
                    {t('back')}
                </FixedOutlinedButton>
            </FixedButtonContainer>
        </Box>
    );
};

export default MastersPage;
