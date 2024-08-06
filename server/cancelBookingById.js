const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri, { useUnifiedTopology: true });
const dbName = 'beauty-booking';
const collectionName = 'bookings';

const cancelBookingById = async (bookingId) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.updateOne(
            { _id: new ObjectId(bookingId) },
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

module.exports = { cancelBookingById };
