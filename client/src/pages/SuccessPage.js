import React from 'react';
import { Container, Typography } from '@mui/material';

const SuccessPage = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Успешное бронирование!
            </Typography>
            <Typography variant="body1">
                Ваше бронирование успешно создано. Мы скоро свяжемся с вами для подтверждения.
            </Typography>
            {/* Можно добавить дополнительную информацию или ссылки */}
        </Container>
    );
};

export default SuccessPage;
