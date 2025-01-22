import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import logo from '../pictures/logo_main.png';
import CoursesService from '../services/CoursesService';
import SignUpToCourse from './SignUpToCourse';
import { useAuth } from './AuthContext';

const demoTheme = createTheme({
  palette: {
    primary: { main: '#3b82f6' },
    secondary: { main: '#ef4444' },
    background: { default: '#FEF1FE' },
    appbarcolor: { default: '#dbb6d3' },
    text: { primary: '#111827' },
  },
  typography: { fontFamily: 'Montserrat, sans-serif' },
});

export default function DashBoard() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CoursesService.getCourses();
        setCourses(response.data);
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки курсов. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleNavigate = (link) => {
    navigate(link);
  };

  const handleSuccessfulSignUp = () => {
    setShowSignUpForm(false);
  };

  const toggleSignUpForm = () => {
    setShowSignUpForm((prev) => !prev);
  };

  const isParent = userInfo && userInfo.userType === 'parent';

  if (loading) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 4 }}>
        Загрузка курсов...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 4, color: 'red' }}>
        {error}
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={demoTheme}>
      <AppProvider>
        <PageContainer>
          <Grid container alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
            <Grid item>
              <img src={logo} alt="Логотип" style={{ height: '70px', marginRight: '26px' }} />
            </Grid>
          </Grid>
          <Typography variant="body1" align="center" sx={{ mt: 2, color: '#666' }}>
            Мы предлагаем разнообразные программы для развития ваших детей!
          </Typography>

          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ mb: 3, fontFamily: 'Poppins, sans-serif' }}>
                Наши курсы и кружки
              </Typography>
              <Divider sx={{ my: 4, borderBottomWidth: 3 }} />
            </Grid>

            {courses.map((course) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={course.courseId}
                onClick={() => handleNavigate(`/courses/${course.courseId}`)}
                sx={{ cursor: 'pointer', textAlign: 'center' }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)' },
                  }}
                >
                  <Box
                    component="img"
                    src={process.env.PUBLIC_URL + course.courseImage}
                    alt={course.courseName}
                    sx={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      filter: 'brightness(100%)',
                      '&:hover': { filter: 'brightness(60%)' },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#fff',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                      }}
                    >
                      Узнать больше
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h6" sx={{ mt: 2 }}>
                  {course.courseName}
                </Typography>
              </Grid>
            ))}

            {isParent && (
              <Grid item xs={12} sx={{ mt: 4, textAlign: 'center' }}>
                {!showSignUpForm ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={toggleSignUpForm}
                  >
                    Записаться на курс
                  </Button>
                ) : (
                  <>
                    <Typography variant="h4" sx={{ mb: 3, fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}>
                      Запись на курс
                    </Typography>
                    <Divider sx={{ my: 4, borderBottomWidth: 3 }} />
                    <SignUpToCourse onSuccessfulSignUp={handleSuccessfulSignUp} />
                    <Button
                      variant="outlined"
                      color="info"
                      size="large"
                      onClick={toggleSignUpForm}
                    >
                      Отмена
                    </Button>
                  </>
                )}
              </Grid>
            )}
          </Grid>
        </PageContainer>
      </AppProvider>
    </ThemeProvider>
  );
}
