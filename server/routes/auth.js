const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Подключаем модель пользователя

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || 'default_secret'; // Секретный ключ JWT

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Проверяем, существует ли пользователь с таким же username
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Хэшируем пароль перед сохранением в базу данных
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя
        const user = await User.create({
            username,
            password: hashedPassword // Сохраняем хэшированный пароль
        });

        // Генерируем JWT токен
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

        // Возвращаем токен в ответе
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Вход пользователя
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Находим пользователя по username
        const user = await User.findOne({ username });

        // Проверяем, существует ли пользователь и совпадает ли пароль
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Генерируем JWT токен
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

        // Возвращаем токен в ответе
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
