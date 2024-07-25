const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service', // Убедитесь, что 'Service' соответствует имени модели услуг
        required: true
    },
    timeslots: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TimeSlot'
        }
    ]
});

module.exports = mongoose.model('Master', masterSchema);


// const mongoose = require('mongoose');
//
// const masterSchema = new mongoose.Schema({
//     name: String,
//     service: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Service'
//     },
//     imageUrl: String,
//     timeslots: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Timeslot'
//     }]
// });

// module.exports = mongoose.model('Master', masterSchema);


// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
//
// const masterSchema = new Schema({
//     // поля модели мастера
// });
//
// // Метод для получения мастера с таймслотами
// masterSchema.statics.getWithTimeslots = async function(masterId) {
//     try {
//         const master = await this.findById(masterId);
//         if (!master) {
//             throw new Error('Master not found');
//         }
//         const timeslots = await mongoose.model('Timeslot').find({ masterId: masterId });
//         master.timeslots = timeslots;
//         return master;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };
//
// const Master = mongoose.model('Master', masterSchema);
// module.exports = Master;
