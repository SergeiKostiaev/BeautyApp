import React from 'react';
import { Container, Typography } from '@mui/material';

const SuccessPage = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Вы записались к мастеру!
            </Typography>
            <Typography variant="body1">
                Ваша запись успешно создана. Мы скоро свяжемся с вами для подтверждения.
            </Typography>
            {/* Можно добавить дополнительную информацию или ссылки */}
        </Container>
    );
};

export default SuccessPage;
