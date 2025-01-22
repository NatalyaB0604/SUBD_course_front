import React, { useState, useEffect } from 'react';
import { Container, Divider, Typography, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Link, IconButton } from '@mui/material';
import CourseService from '../services/CoursesService';
import { Link as RouterLink } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CoursePricing = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await CourseService.getCourses();
        setCourses(courseResponse.data);
        setExpanded(courseResponse.data.map(course => course.courseId));
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setError('Произошла ошибка при загрузке данных.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const abonnementOrder = [
    "2 раза в неделю",
    "1 раз в неделю",
    "Пробное",
    "Разовое"
  ];

  const handleToggle = (courseId) => {
    setExpanded((prev) =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  if (loading) return <Typography variant="h6" align="center">Загрузка данных...</Typography>;
  if (error) return <Typography color="error" variant="h6" align="center">{error}</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Стоимость абонементов на программы учебного года
      </Typography>
      <Divider sx={{ my: 4, borderBottomWidth: 3 }} />
      <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
        Напоминаем вам, что предоплату за следующий месяц обучения нужно производить до 25 числа текущего месяца.
      </Typography>

      <Grid container spacing={3}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <Grid item xs={12} key={course.courseId}>
              <Paper sx={{ p: 3, bgcolor: '#f0f8ff', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {course.courseName || 'Без названия'}
                  <IconButton onClick={() => handleToggle(course.courseId)} sx={{ float: 'right' }}>
                    <ExpandMoreIcon />
                  </IconButton>
                </Typography>
                {expanded.includes(course.courseId) && (
                  <>
                    <Divider sx={{ my: 2, borderBottomWidth: 2 }} />
                    {course.coursePricing && course.coursePricing.length > 0 ? (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Тип абонемента</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Цена за занятие</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Цена за месяц</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {course.coursePricing
                            .sort((a, b) => {
                              const indexA = abonnementOrder.indexOf(a.abonnementType);
                              const indexB = abonnementOrder.indexOf(b.abonnementType);
                              return indexA - indexB;
                            })
                            .map((pricing) => {
                              const totalMonthlyCost = (pricing.pricePerClass * pricing.classesPerMonth).toFixed(2);

                              return (
                                <TableRow key={pricing.id}>
                                  <TableCell sx={{ fontSize: '1rem' }}>
                                    {pricing.abonnementType}
                                    {pricing.abonnementType !== 'Разовое' && pricing.abonnementType !== 'Пробное' && (
                                      <br />
                                    )}
                                    {pricing.abonnementType !== 'Разовое' && pricing.abonnementType !== 'Пробное' && (
                                      `абон. (${pricing.classesPerMonth} занятий)`
                                    )}
                                  </TableCell>
                                  <TableCell>{pricing.pricePerClass.toFixed(2)} BYN</TableCell>
                                  <TableCell>
                                    {pricing.abonnementType !== 'Разовое' && pricing.abonnementType !== 'Пробное' ? (
                                      `${pricing.pricePerClass.toFixed(2)} х ${pricing.classesPerMonth} = ${totalMonthlyCost} BYN`
                                    ) : (
                                      `${totalMonthlyCost} BYN`
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    ) : (
                      <Typography variant="h3" sx={{ textAlign: 'center', mt: 2 }}>
                        Цены не указаны для этого курса
                      </Typography>
                    )}
                    <Link
                      component={RouterLink}
                      to={`/courses/${course.courseId}`}
                      sx={{ mt: 2, display: 'block',textAlign: 'center', color: '#00008B', fontSize: '1.1rem', textDecoration: 'none' }}>
                      Описание данного курса
                    </Link>
                  </>
                )}
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Курсы не найдены.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default CoursePricing;
