import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Divider, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, InputAdornment } from '@mui/material';
import CoursesService from '../services/CoursesService';
import logo from '../pictures/logo_main.png';
import ConfirmationDialog from './ConfirmationDialog';

const ManageCoursesList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCancelEditButton, setShowCancelEditButton] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [disableLinkAndHover, setDisableLinkAndHover] = useState(false);

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
    if (!disableLinkAndHover) {
      navigate(link);
    }
  };

  const handleNavigate2 = (path) =>{
    navigate(path);
  }

  const handleDeleteMode = () => {
    setShowDeleteButton(true);
    setShowEditButton(false);
    setDisableLinkAndHover(true);
  };

  const handleEditMode = () => {
    setShowEditButton(true);
    setShowDeleteButton(false);
    setShowCancelEditButton(true);
    setDisableLinkAndHover(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteButton(false);
    setDisableLinkAndHover(false);
  };

  const handleOpenDialog = (course) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCourse(null);
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      await CoursesService.deleteCourses(selectedCourse.courseId);
      setCourses(courses.filter((course) => course.courseId !== selectedCourse.courseId));
      setShowDeleteButton(false);
      handleCloseDialog();
    } catch (err) {
      console.error('Ошибка при удалении курса:', err);
      alert('Неверный пароль или ошибка удаления.');
    }
  };

  const handleCancelEdit = () => {
    setShowEditButton(false);
    setShowCancelEditButton(false);
    setDisableLinkAndHover(false);
  };

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
    <Grid container sx={{ mt: 4 }}>
      <Grid item xs={12} md={3} sx={{ borderRadius: '8px', boxShadow: 2, padding: 2, height: '100', position: 'sticky', marginTop: '-30px' }}>
        <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
          Управление курсами
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Button variant="contained" color="info" fullWidth onClick={() => handleNavigate('add')}>
          Добавить новый курс
        </Button>

        <Button variant="outlined" color="info" fullWidth onClick={handleEditMode} sx={{ mt: 1 }}>
          Редактировать курс
        </Button>

        {showEditButton && !showCancelEditButton && (
        <Button variant="outlined" color="info" fullWidth onClick={() => setShowCancelEditButton(true)} sx={{ mt: 1 }}>
          Отменить редактирование
        </Button>
        )}

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleDeleteMode}
          sx={{ mt: 1 }}
        >
          Удалить курс
        </Button>

        {showDeleteButton && (
          <Button
            variant="outlined"
            color="default"
            fullWidth
            onClick={handleCancelDelete}
            sx={{ mt: 1 }}
          >
            Отменить удаление
          </Button>
        )}
      </Grid>

      <Grid item xs={12} md={9} sx={{ padding: 2, height: '100%', overflowY: 'auto', marginTop: '-31px' }}>
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
              sx={{ position: 'relative', textAlign: 'center' }}
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
                onClick={() => handleNavigate(`/courses/${course.courseId}`)}
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
                    filter: 'brightness(100%)',
                    transition: 'all 0.3s ease',
                  }}
                />
                {!showDeleteButton && (
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
                )}

                {showDeleteButton && (
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
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(course);
                      }}
                      sx={{
                        color: '#fff',
                        backgroundColor: 'rgba(255, 0, 0, 0.6)',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 0, 0, 0.7)'},
                        }}>
                      Удалить
                    </Button>
                  </Box>
                )}

                {showEditButton && (
                  <Box
                    onClick={() => handleNavigate2(`/manage-course-info/edit/${course.courseId}`)}
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
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        color: '#fff',
                        backgroundColor: 'rgba(0, 123, 255, 0.6)',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 123, 255, 0.7)',
                        },
                      }}
                    >
                      Редактировать
                    </Button>
                  </Box>
                )}
              </Box>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {course.courseName}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteCourse}
        message={`Вы уверены, что хотите удалить курс "${selectedCourse?.courseName}"?`}
      />
    </Grid>
  );
};

export default ManageCoursesList;
