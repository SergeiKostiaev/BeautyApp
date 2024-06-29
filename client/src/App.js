import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import ServicesPage from './pages/ServicesPage.js';
import MastersPage from './pages/MastersPage.js';
import BookingPage from './pages/BookingPage.js';
import SuccessPage from './pages/SuccessPage.js';
import AdminPanel from './AdminPanel.js';
import Login from './components/Login.js';
import TimeSettingsForm from './components/TimeSettingsForm.js';
import ServicesForm from './components/ServicesForm.js';

const App = () => {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    const handleAdminLogin = () => {
        setIsAdminLoggedIn(true);
    };

    const handleAdminLogout = () => {
        setIsAdminLoggedIn(false);
    };

    return (
        <Router>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        DevPrimeClients
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Services
                    </Button>
                    {isAdminLoggedIn ? (
                        <>
                            <Button color="inherit" component={Link} to="/admin">
                                Admin Panel
                            </Button>
                            <Button color="inherit" onClick={handleAdminLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container>
                <Routes>
                    <Route path="/" element={<ServicesPage />} />
                    <Route path="/masters/:serviceId" element={<MastersPage />} />
                    <Route path="/booking/:serviceId" element={<BookingPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route
                        path="/admin/*"
                        element={isAdminLoggedIn ? <AdminPanel /> : <Login onLogin={handleAdminLogin} />}
                    />
                    <Route path="/login" element={<Login onLogin={handleAdminLogin} />} />
                    <Route path="/admin/time-settings" element={<TimeSettingsForm />} />
                    <Route path="/admin/services/new" element={<ServicesForm />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
