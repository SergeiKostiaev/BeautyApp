import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { FaBars } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ServicesPage from './pages/ServicesPage.js';
import MastersPage from './pages/MastersPage.js';
import BookingPage from './pages/BookingPage.js';
import SuccessPage from './pages/SuccessPage.js';
import AdminPanel from './AdminPanel.js';
import Login from './components/Login.js';
import TimeSettingsForm from './components/TimeSettingsForm.js';
import ServicesForm from './components/ServicesForm.js';
import MastersForm from './components/MastersForm.js';
import DeleteMaster from './components/DeleteMasterForm.js';
import DeleteService from './components/DeleteServiceForm.js';
import logo from './DevPrimeClients.png';
import ProtectedRoute from './ProtectedRoute.js';
import './i18n.js';

const countryOptions = {
    '66a7a0bd704fc0eaa855a7ce': 'Canada',
    '66a7a0bd704fc0eaa855a7cf': 'Ukraine',
    '66a7a0bd704fc0eaa855a7d0': 'Poland',
    '66a7a0bd704fc0eaa855a7d1': 'France',
};

const App = () => {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const { t, i18n } = useTranslation();
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [countryAnchorEl, setCountryAnchorEl] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState('66a7a0bd704fc0eaa855a7ce'); // Default countryId

    useEffect(() => {
        const adminStatus = localStorage.getItem('isAdminLoggedIn');
        if (adminStatus === 'true') {
            setIsAdminLoggedIn(true);
        }
    }, []);

    const handleAdminLogin = () => {
        setIsAdminLoggedIn(true);
        localStorage.setItem('isAdminLoggedIn', 'true');
    };

    const handleAdminLogout = () => {
        setIsAdminLoggedIn(false);
        localStorage.removeItem('isAdminLoggedIn');
    };

    const handleLanguageClick = (event) => {
        setLanguageAnchorEl(event.currentTarget);
    };

    const handleLanguageClose = (lng) => {
        i18n.changeLanguage(lng);
        setLanguageAnchorEl(null);
    };

    const handleMenuClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleLogoClick = () => {
        setMenuAnchorEl(null);
        setLanguageAnchorEl(null);
    };

    const handleCountryClick = (event) => {
        setCountryAnchorEl(event.currentTarget);
    };

    const handleCountryClose = (countryId) => {
        setSelectedCountry(countryId);
        setCountryAnchorEl(null);
    };

    const selectedCountryName = countryOptions[selectedCountry] || 'Select Country';

    return (
        <Router>
            <CssBaseline />
            <AppBar position="fixed" style={{ top: 0, left: 0, right: 0, zIndex: 1200 }}>
                <Toolbar style={{ backgroundColor: '#252525', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }} onClick={handleLogoClick}>
                            <h4>Online Services</h4>
                        </Link>
                    </Typography>
                    <div>
                        <IconButton color="inherit" onClick={handleMenuClick}>
                            <FaBars />
                        </IconButton>
                        <Menu
                            anchorEl={menuAnchorEl}
                            keepMounted
                            open={Boolean(menuAnchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem component={Link} to="/" onClick={handleMenuClose} style={{ color: '#252525' }}>
                                {t('select_service')}
                            </MenuItem>
                            {!isAdminLoggedIn && (
                                <MenuItem component={Link} to="/login" onClick={handleMenuClose} style={{ color: '#252525' }}>
                                    {t('Login')}
                                </MenuItem>
                            )}
                            {isAdminLoggedIn && (
                                <MenuItem component={Link} to="/admin" onClick={handleMenuClose} style={{ color: '#252525' }}>
                                    {t('Admin Panel')}
                                </MenuItem>
                            )}
                            {isAdminLoggedIn && (
                                <MenuItem onClick={() => { handleAdminLogout(); handleMenuClose(); }} style={{ color: '#252525' }}>
                                    {t('Logout')}
                                </MenuItem>
                            )}
                        </Menu>
                        <Button color="inherit" onClick={handleLanguageClick} style={{ color: '#FFFFFF' }}>
                            {i18n.language === 'ua' ? 'UA' : 'EN'}
                        </Button>
                        <Menu
                            anchorEl={languageAnchorEl}
                            keepMounted
                            open={Boolean(languageAnchorEl)}
                            onClose={() => setLanguageAnchorEl(null)}
                        >
                            <MenuItem onClick={() => handleLanguageClose('en')}>English</MenuItem>
                            <MenuItem onClick={() => handleLanguageClose('ua')}>Українська</MenuItem>
                        </Menu>
                        <Button color="inherit" onClick={handleCountryClick} style={{ color: '#FFFFFF' }}>
                            {selectedCountryName}
                        </Button>
                        <Menu
                            anchorEl={countryAnchorEl}
                            keepMounted
                            open={Boolean(countryAnchorEl)}
                            onClose={() => setCountryAnchorEl(null)}
                        >
                            {Object.keys(countryOptions).map(countryId => (
                                <MenuItem key={countryId} onClick={() => handleCountryClose(countryId)}>
                                    {countryOptions[countryId]}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Container style={{ marginTop: '80px', paddingBottom: '50px' }}>
                <Routes>
                    <Route path="/" element={<ServicesPage selectedCountry={selectedCountry} />} />
                    <Route path="/masters/:serviceId" element={<MastersPage />} />
                    <Route path="/booking/:masterId" element={<BookingPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login onLogin={handleAdminLogin} />} />
                    <Route
                        path="/admin/time-settings"
                        element={
                            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
                                <TimeSettingsForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/services/new"
                        element={
                            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
                                <ServicesForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/masters/new"
                        element={
                            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
                                <MastersForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/masters/delete"
                        element={
                            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
                                <DeleteMaster />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/services/delete"
                        element={
                            <ProtectedRoute isLoggedIn={isAdminLoggedIn}>
                                <DeleteService />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Container>
        </Router>
    );
};

export default App
