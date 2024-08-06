// server/routes/login.js
const express = require('express');
const router = express.Router();

const fixedUsername = process.env.FIXED_USERNAME || 'admin';
const fixedPassword = process.env.FIXED_PASSWORD || 'V{@9m2';

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === fixedUsername && password === fixedPassword) {
        // Генерация JWT токена или другой подход для аутентификации
        const token = 'dummy-jwt-token'; // Замените это на реальную генерацию токена
        res.status(200).json({ token, user: { username, role: 'admin' } });
    } else {
        res.status(400).send('Неверные учетные данные');
    }
});

module.exports = router;
