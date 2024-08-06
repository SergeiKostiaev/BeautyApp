// const fetch = require('node-fetch'); // Используем require для импортирования
//
// const sendToTelegram = async (message, bookingId) => {
//     const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
//
//     await fetch(telegramUrl, {
//         method: 'POST',
//         body: JSON.stringify({
//             chat_id: process.env.TELEGRAM_CHAT_ID, // Убедитесь, что у вас есть этот ID в переменных окружения
//             text: `${message}\nCancel booking: /cancel_${bookingId}`, // Пример текста сообщения
//             parse_mode: 'HTML',
//         }),
//         headers: { 'Content-Type': 'application/json' },
//     });
// };
//
// module.exports = sendToTelegram;

const fetch = require('node-fetch'); // Используем require вместо import

const sendToTelegram = async (message, bookingId) => {
    const telegramToken = '7130422316:AAFt7OXkbmV0_ObdPOiGs6v44bXhQCGAAPY';
    const chatId = '414951154'; // Замените на правильный ID чата
    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    try {
        // Проверяем, что bookingId не undefined и имеет корректный формат
        if (!bookingId || typeof bookingId !== 'string') {
            throw new Error('Invalid bookingId');
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

module.exports = sendToTelegram; // Используем module.exports вместо export default

