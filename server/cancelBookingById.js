const { MongoClient, ObjectId } = require('mongodb'); // Убедитесь, что импортируете ObjectId

const uri = 'mongodb://localhost:27017/'; // Замените на ваш URI
const client = new MongoClient(uri, { useUnifiedTopology: true });
const dbName = 'beauty-booking'; // Замените на имя вашей базы данных
const collectionName = 'bookings'; // Замените на имя вашей коллекции

const cancelBookingById = async (bookingId) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.updateOne(
            { _id: new ObjectId(bookingId) }, // Используйте new ObjectId()
            { $set: { booked: false } }
        );

        if (result.matchedCount === 0) {
            throw new Error('Booking not found');
        }

        console.log(`Booking ${bookingId} cancelled`);
    } catch (error) {
        console.error('Ошибка при отмене бронирования:', error);
        throw error;
    } finally {
        await client.close();
    }
};
