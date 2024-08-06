import React, { useState } from 'react';
import { Button, TextField, Typography, Box, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StyledPrimaryButton = styled(Button)({
    backgroundColor: '#252525',
    color: '#FFFFFF',
    '&:hover': {
        backgroundColor: '#1f1f1f',
    },
});

// Используем переменные окружения
const fixedUsername = process.env.REACT_APP_LOGIN_USERNAME;
const fixedPassword = process.env.REACT_APP_LOGIN_PASSWORD;

const LoginForm = ({ onLogin }) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === fixedUsername && password === fixedPassword) {
            onLogin();
            navigate('/admin');
        } else {
            setError(t('login.invalid_credentials'));
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                {t('login.title')}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label={t('login.username')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                />
                <TextField
                    fullWidth
                    type="password"
                    label={t('login.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                />
                {error && <Typography color="error">{error}</Typography>}
                <Box mt={2}>
                    <StyledPrimaryButton type="submit" variant="contained">
                        {t('login.login_button')}
                    </StyledPrimaryButton>
                </Box>
            </form>
        </Box>
    );
};

export default LoginForm;
