import React from 'react';
import { Container, Box, Typography, Card, CardContent, CardMedia, Divider } from '@mui/material';
import Disc1 from '../pictures/disc1.png';
import Disc2 from '../pictures/disc2.png';
import Disc3 from '../pictures/disc3.png';

const discounts = [
  {
    title: 'Бесплатное пробное занятие',
    description: 'Запишитесь на пробное занятие и убедитесь в качестве наших программ!',
    image: Disc1,
  },
  {
    title: '«Сестрички-братики» – скидка 10%',
    description: 'Скидка на обучение для детей из одной семьи. Необходимые документы: копия паспорта, свидетельства о рождении детей.',
    image: Disc2,
  },
  {
    title: 'Скидка 10% для многодетных семей',
    description: 'Мы предоставляем скидки для детей из многодетных семей. Необходимые документы: копия удостоверения многодетной семьи, паспорта, свидетельства о рождении ребенка.',
    image: Disc3,
  },
];

const Discounts = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" align='center' gutterBottom>
        Скидки и акции
      </Typography>
      <Divider sx={{ my: 4, borderBottomWidth: 3 }} />

      {discounts.map((discount, index) => (
        <Card key={index} sx={{ display: 'flex', mb: 4, boxShadow: 3 }}>
          <CardMedia
            component="img"
            sx={{ width: 200 }}
            image={discount.image}
            alt={discount.title}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#1976d2'}}>
                {discount.title}
              </Typography>
              <Typography variant="body1" sx={{ my: 2 }}>
                {discount.description}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Container>
  );
};

export default Discounts;
