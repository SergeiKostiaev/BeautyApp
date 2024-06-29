import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Заменяем useHistory на useNavigate

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            onLogin();
            navigate('/admin'); // Используем navigate для перехода на /admin
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Login</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                />
                {error && <Typography color="error">{error}</Typography>}
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary">Login</Button>
                </Box>
            </form>
        </Box>
    );
};

export default LoginForm;
