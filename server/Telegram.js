const fetch = require('node-fetch');

const telegramToken = '7130422316:AAFt7OXkbmV0_ObdPOiGs6v44bXhQCGAAPY';
const telegramUrl = `https://api.telegram.org/bot${telegramToken}`;
// Функция отправки сообщения в Telegram
const sendToTelegram = async (message, bookingId) => {
    try {
        if (!bookingId || typeof bookingId !== 'string') {
            throw new Error('Invalid bookingId');
        }

        console.log('Sending message to Telegram with bookingId:', bookingId); // Логируем ID бронирования

        const response = await fetch(`${telegramUrl}/sendMessage`, {
            method: 'POST',
            body: JSON.stringify({
                chat_id: '414951154', // Замените на правильный ID чата
                text: `${message}\n\nBooking ID: ${bookingId}`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Отменить запись',
                                callback_data: `cancel_${bookingId}`
                            }
                        ]
                    ]
                }
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        const responseBody = await response.json();
        console.log('Response from Telegram:', responseBody);

        if (!response.ok) {
            throw new Error(`Telegram API responded with status ${response.status}`);
        }
        console.log('Message sent to Telegram');
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        throw error;
    }
};

// Экспортируем функцию
module.exports = sendToTelegram;
