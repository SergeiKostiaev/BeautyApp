import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, styled } from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createBooking } from '../components/bookingService.js';

const StyledButton = styled(Button)(({ theme }) => ({
    position: 'fixed',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 20px)',
    maxWidth: '500px',
    backgroundColor: '#252525',
    color: '#FFFFFF',
    '&:hover': {
        backgroundColor: '#1f1f1f',
    },
}));

const BookingPage = () => {
    const { t } = useTranslation();
    const { masterId } = useParams();
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [date, setDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (date && masterId) {
            fetchAvailableTimeSlots();
        }
    }, [date, masterId]);

    const fetchAvailableTimeSlots = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://devprimeclients.ru/api/time-slots/master/${masterId}`, {
                params: { date },
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
            });
            console.log('API response data:', response.data);

            if (response.data && Array.isArray(response.data)) {
                const timeSlotsWithAvailability = response.data.map(slot => ({
                    ...slot,
                    isAvailable: !slot.booked,
                }));
                setAvailableTimeSlots(timeSlotsWithAvailability);
            } else {
                console.error('Unexpected response format:', response.data);
                setError(t('booking_page.loading_error'));
            }
        } catch (error) {
            console.error('Error fetching available time slots:', error);
            setError(t('booking_page.loading_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = useCallback((newDate) => {
        setDate(newDate);
        setAvailableTimeSlots([]);
    }, []);

    const updateTimeSlotStatus = async (slotId) => {
        try {
            const response = await axios.put(`https://devprimeclients.ru/api/time-slots/${slotId}`, {
                booked: true,
            });
            console.log('Time slot updated:', response.data);
        } catch (error) {
            console.error('Error updating time slot:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!customerName || !customerPhone || !date || !selectedTimeSlot) {
            setError(t('booking_page.fill_all_fields'));
            return;
        }

        const bookingData = {
            masterId,
            customerName,
            customerPhone,
            date,
            time: selectedTimeSlot.startTime,
        };

        try {
            setLoading(true);
            const response = await createBooking(bookingData);
            console.log('Booking created:', response);

            // Обновление статуса временного интервала
            await updateTimeSlotStatus(selectedTimeSlot._id);

            await fetchAvailableTimeSlots();
            setBookingSuccess(true);
        } catch (error) {
            console.error('Error creating booking:', error);
            setError(t('booking_page.booking_error'));
        } finally {
            setLoading(false);
        }
    };

    if (bookingSuccess) {
        return <Navigate to="/success" />;
    }

    return (
        <Container style={{ paddingTop: '50px', paddingBottom: '70px' }}>
            <Typography variant="h4" component="h1" align="center" style={{ marginBottom: '20px', fontSize: '25px', fontWeight: '600' }}>
                {t('booking_page.title')}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label={t('booking_page.customer_name')}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label={t('booking_page.customer_phone')}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label={t('booking_page.date')}
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />
                {date && (
                    <div style={{ marginTop: '1rem' }}>
                        {availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((slot) => (
                                <Button
                                    key={slot._id}
                                    variant="contained"
                                    style={{
                                        margin: '0.5rem',
                                        backgroundColor: slot.isAvailable ? '#252525' : '#f50057',
                                        color: 'white',
                                        pointerEvents: slot.isAvailable ? 'auto' : 'none'
                                    }}
                                    onClick={() => slot.isAvailable && setSelectedTimeSlot(slot)}
                                    disabled={!slot.isAvailable}
                                >
                                    {`${slot.startTime} - ${slot.endTime}`}
                                </Button>
                            ))
                        ) : (
                            <Typography variant="body2">{t('booking_page.no_time_slots')}</Typography>
                        )}
                    </div>
                )}
                <StyledButton
                    type="submit"
                    variant="contained"
                    disabled={!selectedTimeSlot}
                >
                    {t('booking_page.book_button')}
                </StyledButton>
                {error && (
                    <Typography variant="body2" color="error" style={{ marginTop: '1rem' }}>
                        {error}
                    </Typography>
                )}
            </form>
        </Container>
    );
};

export default BookingPage;
