const fetch = require('node-fetch');
const telegramToken = '7130422316:AAFt7OXkbmV0_ObdPOiGs6v44bXhQCGAAPY';
const chatId = '414951154';
const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

const sendToTelegram = async (message, bookingId) => {
    try {
        const response = await fetch(telegramUrl, {
            method: 'POST',
            body: JSON.stringify({
                chat_id: chatId,
                text: `${message}\n\nBooking ID: ${bookingId}`,
                parse_mode: 'HTML',
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
