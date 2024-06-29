import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const MastersForm = () => {
    const [masterName, setMasterName] = useState('');
    const [masterImage, setMasterImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setMasterImage(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Отправка данных формы (например, через API)
        console.log('Master Name:', masterName);
        console.log('Master Image:', masterImage);
        // Дополнительные действия для сохранения данных
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Имя мастера"
                value={masterName}
                onChange={(e) => setMasterName(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <input type="file" onChange={handleImageChange} />
            <Button type="submit" variant="contained" color="primary">
                Добавить мастера
            </Button>
        </form>
    );
};

export default MastersForm;
