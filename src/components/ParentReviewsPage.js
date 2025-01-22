/*import React, { useEffect, useState } from 'react';
import ReviewsService from '../services/ReviewsService';
import CourseService from '../services/CoursesService';
import { Container, Typography, Grid, Box, Button, TextField, MenuItem, Rating } from '@mui/material';
import { useAuth } from './AuthContext';

const MyReviewsPage = () => {
  const { userInfo } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [newReviewText, setNewReviewText] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [rating, setRating] = useState(0);

  const fetchReviewsAndCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      const reviewsResponse = await ReviewsService.getReviewByParentId(userInfo?.data?.parentId);
      setReviews(reviewsResponse.data);

      const coursesResponse = await CourseService.getCourses();
      setCourses(coursesResponse.data);
    } catch (err) {
      console.error('Ошибка при загрузке отзывов или курсов:', err);
      setError('Произошла ошибка при загрузке данных.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.data?.parentId) {
      fetchReviewsAndCourses();
    }else {
      setLoading(false);
    }
  }, [userInfo]);

  const handleOpen = (review) => {
    setSelectedReview(review);
    setNewReviewText(review.reviewText);
    setRating(review.rating);
    setSelectedCourseId(review.courseId);
    setShowAddReview(true);
  };

  const handleClose = () => {
    setShowAddReview(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedReview(null);
    setNewReviewText('');
    setRating(0);
    setSelectedCourseId('');
  };

  const handleSubmitReview = async () => {
    if (!newReviewText.trim() || !selectedCourseId || rating === 0) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const parentId = userInfo?.data?.parentId;
      const courseId = selectedCourseId;

      const newReview = {
        parentId,
        courseId,
        reviewText: newReviewText.trim(),
        rating,
      };

      if (selectedReview) {
        await ReviewsService.updateReview(selectedReview.reviewId, newReview);
        alert('Отзыв успешно обновлен');
      } else {
        await ReviewsService.createReview(courseId, parentId, newReview);
        alert('Отзыв успешно добавлен');
      }

      handleClose();
      fetchReviewsAndCourses();
    } catch (err) {
      console.error('Ошибка при добавлении или обновлении отзыва:', err);
      alert('Произошла ошибка при добавлении или обновлении отзыва');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить этот отзыв?');
    if (!confirmed) return;

    try {
      await ReviewsService.deleteReview(reviewId);
      fetchReviewsAndCourses();
    } catch (err) {
      console.error('Ошибка при удалении отзыва:', err);
      alert('Произошла ошибка при удалении отзыва');
    }
  };

  if (loading) return <Typography variant="h6" align="center">Загрузка отзывов...</Typography>;
  if (error) return <Typography color="error" variant="h6" align="center">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Мои отзывы
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Button variant="contained" color="primary" onClick={() => {
          resetForm();
          setShowAddReview(true);
        }}>
          Добавить отзыв
        </Button>
      </Box>

      {showAddReview && (
        <Box sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
          <Typography variant="h6" gutterBottom>Добавить/редактировать отзыв</Typography>

          <TextField
            fullWidth
            select
            label="Выберите курс"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            sx={{ mb: 2 }}
          >
            {courses.map((course) => (
              <MenuItem key={course.courseId} value={course.courseId}>
                {course.courseName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Ваш отзыв"
            variant="outlined"
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <Rating
            name="rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            sx={{ mb: 2 }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitReview}
            >
              {selectedReview ? 'Обновить отзыв' : 'Добавить отзыв'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ ml: 2 }}
            >
              Отмена
            </Button>
          </Box>
        </Box>
      )}

      <Grid container spacing={3}>
        {reviews.map((review) => {
          const course = courses.find(course => course.courseId === review.courseId);
          const courseName = course ? course.courseName : 'Неизвестен';

          return (
            <Grid item xs={12} sm={6} md={4} key={review.reviewId}>
              <Box
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: '#f0f8ff',
                  height: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {courseName}
                  </Typography>
                  <Typography
                  variant="body2"
                  sx={{
                    fontStyle: 'italic',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    mb: 1,
                  }}
                >
                  "{review.reviewText}"
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    gutterBottom
                    sx={{ display: 'block', textAlign: 'center', mb: 1 }}
                  >
                    <Rating
                      name={`rating-${review.reviewId}`}
                      value={review.rating}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    gutterBottom
                    sx={{ display: 'block', textAlign: 'center', mb: 2 }}
                  >
                    {review.date}
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleOpen(review)}
                  sx={{ marginTop: 'auto' }}
                >
                  Редактировать
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteReview(review.reviewId)}
                  sx={{ marginTop: 1 }}
                >
                  Удалить
                </Button>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default MyReviewsPage;*/

import React, { useEffect, useState } from 'react';
import ReviewsService from '../services/ReviewsService';
import CourseService from '../services/CoursesService';
import SignUpsService from '../services/SignUpsService';
import { Container, Typography, Grid, Box, Button, TextField, MenuItem, Rating } from '@mui/material';
import { useAuth } from './AuthContext';

const MyReviewsPage = () => {
  const { userInfo } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [confirmedCourses, setConfirmedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [newReviewText, setNewReviewText] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [rating, setRating] = useState(0);

  const fetchReviewsAndCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      const reviewsResponse = await ReviewsService.getReviewByParentId(userInfo?.data?.parentId);
      setReviews(reviewsResponse.data);

      const coursesResponse = await CourseService.getCourses();
      setCourses(coursesResponse.data);

      const signUpsResponse = await SignUpsService.getSignUpsByParentId(userInfo?.data?.parentId);
      const confirmedSignUps = signUpsResponse.data.filter(signUp => signUp.status === 'CONFIRMED');
      const confirmedCourseIds = confirmedSignUps.map(signUp => signUp.courseId);
      const filteredCourses = coursesResponse.data.filter(course => confirmedCourseIds.includes(course.courseId));
      setConfirmedCourses(filteredCourses);
    } catch (err) {
      console.error('Ошибка при загрузке отзывов или курсов:', err);
      setError('Произошла ошибка при загрузке данных.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.data?.parentId) {
      fetchReviewsAndCourses();
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  const handleOpen = (review) => {
    setSelectedReview(review);
    setNewReviewText(review.reviewText);
    setRating(review.rating);
    setSelectedCourseId(review.courseId);
    setShowAddReview(true);
  };

  const handleClose = () => {
    setShowAddReview(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedReview(null);
    setNewReviewText('');
    setRating(0);
    setSelectedCourseId('');
  };

  const handleSubmitReview = async () => {
    if (!newReviewText.trim() || !selectedCourseId || rating === 0) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const parentId = userInfo?.data?.parentId;
      const courseId = selectedCourseId;

      const newReview = {
        parentId,
        courseId,
        reviewText: newReviewText.trim(),
        rating,
      };

      if (selectedReview) {
        await ReviewsService.updateReview(selectedReview.reviewId, newReview);
        alert('Отзыв успешно обновлен');
      } else {
        await ReviewsService.createReview(courseId, parentId, newReview);
        alert('Отзыв успешно добавлен');
      }

      handleClose();
      fetchReviewsAndCourses();
    } catch (err) {
      console.error('Ошибка при добавлении или обновлении отзыва:', err);
      alert('Произошла ошибка при добавлении или обновлении отзыва');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить этот отзыв?');
    if (!confirmed) return;

    try {
      await ReviewsService.deleteReview(reviewId);
      fetchReviewsAndCourses();
    } catch (err) {
      console.error('Ошибка при удалении отзыва:', err);
      alert('Произошла ошибка при удалении отзыва');
    }
  };

  if (loading) return <Typography variant="h6" align="center">Загрузка отзывов...</Typography>;
  if (error) return <Typography color="error" variant="h6" align="center">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Мои отзывы
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Button variant="contained" color="primary" onClick={() => {
          resetForm();
          setShowAddReview(true);
        }}>
          Добавить отзыв
        </Button>
      </Box>

      {showAddReview && (
        <Box sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
          <Typography variant="h6" gutterBottom>Добавить/редактировать отзыв</Typography>

          <TextField
            fullWidth
            select
            label="Выберите курс"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            sx={{ mb: 2 }}
          >
            {confirmedCourses.map((course) => (
              <MenuItem key={course.courseId} value={course.courseId}>
                {course.courseName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Ваш отзыв"
            variant="outlined"
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <Rating
            name="rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            sx={{ mb: 2 }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitReview}
            >
              {selectedReview ? 'Обновить отзыв' : 'Добавить отзыв'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ ml: 2 }}
            >
              Отмена
            </Button>
          </Box>
        </Box>
      )}

      <Grid container spacing={3}>
        {reviews.map((review) => {
          const course = confirmedCourses.find(course => course.courseId === review.courseId);
          const courseName = course ? course.courseName : 'Неизвестен';

          return (
            <Grid item xs={12} sm={6} md={4} key={review.reviewId}>
              <Box
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: '#f0f8ff',
                  height: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {courseName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: 'italic',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      mb: 1,
                    }}
                  >
                    "{review.reviewText}"
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    gutterBottom
                    sx={{ display: 'block', textAlign: 'center', mb: 1 }}
                  >
                    <Rating
                      name={`rating-${review.reviewId}`}
                      value={review.rating}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    gutterBottom
                    sx={{ display: 'block', textAlign: 'center', mb: 2 }}
                  >
                    {review.date}
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleOpen(review)}
                  sx={{ marginTop: 'auto' }}
                >
                  Редактировать
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteReview(review.reviewId)}
                  sx={{ marginTop: 1 }}
                >
                  Удалить
                </Button>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default MyReviewsPage;
