const fetch = require('node-fetch');

const telegramToken = '7130422316:AAFt7OXkbmV0_ObdPOiGs6v44bXhQCGAAPY';
const telegramUrl = `https://api.telegram.org/bot${telegramToken}`;

// Функция отправки сообщения в Telegram
const sendToTelegram = async (message, bookingId) => {
    try {
        console.log('Attempting to send message to Telegram');
        console.log('Message:', message);
        console.log('Booking ID:', bookingId);

        if (!bookingId || typeof bookingId !== 'string') {
            console.error('Invalid or missing bookingId');
            throw new Error('Invalid or missing bookingId');
        }

        const response = await fetch(`${telegramUrl}/sendMessage`, {
            method: 'POST',
            body: JSON.stringify({
                chat_id: '414951154',
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
