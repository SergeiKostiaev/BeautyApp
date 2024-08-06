import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Box, Typography, List, ListItem, Button, styled } from '@mui/material';
import { useTranslation } from 'react-i18next'; // Импорт хука для использования переводов
import ServicesForm from './components/ServicesForm.js';
import MastersForm from './components/MastersForm.js';
import TimeSettingsForm from './components/TimeSettingsForm.js';
import DeleteMasterForm from './components/DeleteMasterForm.js';
import DeleteServiceForm from './components/DeleteServiceForm.js';

const StyledListItem = styled(ListItem)(({ theme }) => ({
    backgroundColor: '#D9D9D9',
    borderRadius: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    padding: '10px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#252525',
    color: '#FFFFFF',
    '&:hover': {
        backgroundColor: '#7b1fa2', // Установите цвет при наведении
    },
}));

const AdminPanel = () => {
    const { t } = useTranslation(); // Инициализация хука перевода

    return (
        <Box px={2} py={2} style={{ marginTop: '70px', marginLeft: '20px', marginRight: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: '25px', fontWeight: '600', textAlign: 'center' }}>
                {t('adminPanel')}
            </Typography>
            <nav>
                <List>
                    <StyledListItem component="li" disablePadding>
                        <Link to="/admin/services/new" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                            <StyledButton variant="contained" color="primary" fullWidth>
                                {t('addService')}
                            </StyledButton>
                        </Link>
                    </StyledListItem>
                    <StyledListItem component="li" disablePadding>
                        <Link to="/admin/masters/new" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                            <StyledButton variant="contained" color="primary" fullWidth>
                                {t('addMaster')}
                            </StyledButton>
                        </Link>
                    </StyledListItem>
                    <StyledListItem component="li" disablePadding>
                        <Link to="/admin/time-settings" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                            <StyledButton variant="contained" color="primary" fullWidth>
                                {t('timeSettings')}
                            </StyledButton>
                        </Link>
                    </StyledListItem>
                    <StyledListItem component="li" disablePadding>
                        <Link to="/admin/masters/delete" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                            <StyledButton variant="contained" color="primary" fullWidth>
                                {t('deleteMaster')}
                            </StyledButton>
                        </Link>
                    </StyledListItem>
                    <StyledListItem component="li" disablePadding>
                        <Link to="/admin/services/delete" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                            <StyledButton variant="contained" color="primary" fullWidth>
                                {t('deleteService')}
                            </StyledButton>
                        </Link>
                    </StyledListItem>
                </List>
            </nav>
            <Routes>
                <Route path="/admin/services/new" element={<ServicesForm />} />
                <Route path="/admin/masters/new" element={<MastersForm />} />
                <Route path="/admin/time-settings" element={<TimeSettingsForm />} />
                <Route path="/admin/masters/delete" element={<DeleteMasterForm />} />
                <Route path="/admin/services/delete" element={<DeleteServiceForm />} />
            </Routes>
        </Box>
    );
};

export default AdminPanel;
