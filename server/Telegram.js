const fetch = require('node-fetch'); // Убедитесь, что вы используете `require`

const sendToTelegram = async (message, bookingId) => {
    const telegramToken = '7130422316:AAFt7OXkbmV0_ObdPOiGs6v44bXhQCGAAPY';
    const chatId = '414951154'; // Замените на правильный ID чата
    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    try {
        // Проверяем, что bookingId не undefined и имеет корректный формат
        if (!bookingId || typeof bookingId !== 'string') {
            throw new Error('Invalid bookingId: ' + bookingId); // Добавляем больше информации
        }

        const response = await fetch(telegramUrl, {
            method: 'POST',
            body: JSON.stringify({
                chat_id: chatId,
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

module.exports = sendToTelegram;
