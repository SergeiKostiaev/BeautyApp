const fetch = require('node-fetch'); // Используем require для импортирования

const sendToTelegram = async (message, bookingId) => {
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;

    await fetch(telegramUrl, {
        method: 'POST',
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID, // Убедитесь, что у вас есть этот ID в переменных окружения
            text: `${message}\nCancel booking: /cancel_${bookingId}`, // Пример текста сообщения
            parse_mode: 'HTML',
        }),
        headers: { 'Content-Type': 'application/json' },
    });
};

module.exports = sendToTelegram;
