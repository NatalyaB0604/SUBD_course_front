import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
    <Typography variant="h4" component="h1" align='center' gutterBottom>
      О детском центре ВундерКидс
    </Typography>
    <Divider sx={{ my: 4, borderBottomWidth: 3 }} />

      <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
        Мы предлагаем разнообразные программы для развития детей от 1 до 16 лет.
        С более чем 25-летним опытом, мы помогаем каждому ребенку раскрыть свой потенциал.
      </Typography>

      <Box
        sx={{
          bgcolor: '#f0f8ff',
          borderRadius: 2,
          p: 4,
          mb: 4
        }}
      >
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Часы работы
        </Typography>
        <Divider sx={{ my: 2, borderBottomWidth: 3 }} />
        <Typography variant="body1">
          Центр работает круглый год с 9:00 до 20:00.
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: '#fff5e1',
          borderRadius: 2,
          p: 4,
          mb: 4
        }}
      >
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Расписание занятий
        </Typography>
        <Divider sx={{ my: 2, borderBottomWidth: 3 }} />
        <Typography variant="body1">
          Занятия проходят в течение учебного года с 1 сентября по 31 мая.
          Летнее расписание может изменяться.
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: '#e8f5e9',
          borderRadius: 2,
          p: 4,
          mb: 4
        }}
      >
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Выходные дни
        </Typography>
        <Divider sx={{ my: 2, borderBottomWidth: 3 }} />
        <Typography variant="body1">
          Центр закрыт в следующие праздничные дни:
        </Typography>
        <ul>
          <li>25 декабря</li>
          <li>31 декабря</li>
          <li>1 января</li>
          <li>2 января</li>
          <li>7 января</li>
          <li>8 марта</li>
          <li>Пасхальное воскресенье и Радуница</li>
          <li>1 мая</li>
          <li>9 мая</li>
          <li>3 июля</li>
        </ul>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Все остальные дни учебный центр работает по составленному на учебный год расписанию.
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: '#ffe0b2',
          borderRadius: 2,
          p: 4,
          mb: 4
        }}
      >
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Адреса филиалов
        </Typography>
        <Divider sx={{ my: 2, borderBottomWidth: 3 }} />
        <Typography variant="body1">
          1) ул. Долгобродская, 24
          <br />
          2) ул. Притыцкого, 2/2
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: '#d1c4e9',
          borderRadius: 2,
          p: 4
        }}
      >
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Контакты
        </Typography>
        <Divider sx={{ my: 2, borderBottomWidth: 3 }} />
        <Typography variant="body1">
          Телефон: +375(29)709-20-25
          <br />
          Email: info@vunder_kids.by
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
