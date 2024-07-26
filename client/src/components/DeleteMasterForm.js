import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, MenuItem, Select, Button, styled, Alert } from '@mui/material'; // Импортируйте Alert
import { useTranslation } from 'react-i18next';

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#252525',
    color: '#FFFFFF',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const DeleteMasterForm = () => {
    const { t } = useTranslation();
    const [masters, setMasters] = useState([]);
    const [selectedMasterId, setSelectedMasterId] = useState('');
    const [error, setError] = useState(null); // Состояние для ошибки
    const [success, setSuccess] = useState(null); // Состояние для успешного удаления

    useEffect(() => {
        axios.get('http://31.172.75.47:5000/api/masters')
            .then(response => setMasters(response.data))
            .catch(error => console.error('Error fetching masters:', error));
    }, []);

    const handleDelete = () => {
        if (!selectedMasterId) {
            alert('Please select a master to delete');
            return;
        }

        axios.delete(`http://31.172.75.47:5000/api/masters/${selectedMasterId}`)
            .then(() => {
                setMasters(masters.filter(master => master._id !== selectedMasterId));
                setSelectedMasterId('');
                setSuccess('Master deleted successfully!'); // Успешное удаление
                setError(null); // Очистите ошибку
            })
            .catch(error => {
                console.error('There was an error deleting the master!', error);
                setError(`Error deleting master: ${error.response ? error.response.data.message : error.message}`); // Ошибка удаления
                setSuccess(null); // Очистите сообщение об успехе
            });
    };

    return (
        <Box px={2} py={2}>
            <Typography variant="h6" component="h2" gutterBottom>
                {t('deleteMaster')}
            </Typography>
            <Select
                value={selectedMasterId}
                onChange={(e) => setSelectedMasterId(e.target.value)}
                displayEmpty
                fullWidth
            >
                <MenuItem value="" disabled>
                    {t('selectMaster')}
                </MenuItem>
                {masters.map(master => (
                    <MenuItem key={master._id} value={master._id}>
                        {master.name}
                    </MenuItem>
                ))}
            </Select>
            <StyledButton
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleDelete}
                disabled={!selectedMasterId}
                style={{ marginTop: '10px' }}
            >
                {t('delete')}
            </StyledButton>
            {error && (
                <Alert severity="error" style={{ marginTop: 20 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" style={{ marginTop: 20 }}>
                    {success}
                </Alert>
            )}
        </Box>
    );
};

export default DeleteMasterForm;
