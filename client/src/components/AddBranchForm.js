import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AddBranchForm = () => {
    const { t } = useTranslation();
    const [branchName, setBranchName] = useState('');
    const [branchAddress, setBranchAddress] = useState('');
    const [branchImage, setBranchImage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', branchName);
        formData.append('address', branchAddress);
        if (branchImage) {
            formData.append('image', branchImage);
        }
        try {
            const response = await axios.post('https://devprimeclients.ru/api/branches', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Branch added successfully!');
        } catch (error) {
            console.error('Error adding branch:', error);
        }
    };

    return (
        <Box px={2} py={2}>
            <Typography variant="h4" gutterBottom>
                {t('add_branch')}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label={t('branch_name')}
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label={t('branch_address')}
                    value={branchAddress}
                    onChange={(e) => setBranchAddress(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <input
                    type="file"
                    onChange={(e) => setBranchImage(e.target.files[0])}
                    style={{ margin: '10px 0' }}
                />
                <Button type="submit" variant="contained" color="primary">
                    {t('add_branch')}
                </Button>
            </form>
        </Box>
    );
};

export default AddBranchForm;
