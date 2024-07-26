const express = require('express');
const router = express.Router();
const Service = require('../models/Service'); // Модель для работы с коллекцией "services"

// Маршрут для удаления сервиса по ID
router.delete('/services/:id', async (req, res) => {
    const serviceId = req.params.id;

    try {
        const result = await Service.findByIdAndDelete(serviceId);
        if (!result) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
