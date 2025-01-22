import React, { useEffect, useState } from 'react';
import ReviewsService from '../services/ReviewsService';
import CourseService from '../services/CoursesService';
import ParentsService from '../services/ParentsService';
import { Container, Typography, Grid, Box, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, Rating, Select, InputLabel, FormControl, Snackbar, IconButton, Menu } from '@mui/material';
import { useAuth } from './AuthContext';
import FilterListIcon from '@mui/icons-material/FilterList';

const ReviewsPage = ({isManagement, onDeleteReview }) => {
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [newReviewText, setNewReviewText] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');
  const [showAddReview, setShowAddReview] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState('');
  const { isAuthenticated, userInfo } = useAuth();

  useEffect(() => {
    const fetchReviewsAndCourses = async () => {
      try {
        const reviewsResponse = await ReviewsService.getAllReviews();
        const reviewsData = reviewsResponse.data;

        const coursesResponse = await CourseService.getCourses();
        const coursesData = coursesResponse.data;

        const parentResponse = await ParentsService.getParents();
        const parentData = parentResponse.data;

        setCourses(coursesData);

        const parentMap = parentData.reduce((map, parent) => {
          map[parent.parentId] = parent;
          return map;
        }, {});

        const enrichedReviews = reviewsData.map(review => {
          const parent = parentMap[review.parentId];
          const children = parent ? parent.children : [];

          const childNames = children.map(child => `${child.firstName} ${child.lastName}`);
          const childLabel = childNames.length > 1 ? 'Ученики:' : 'Ученик:';
          const childNameString = childNames.join(', ');

          const createdAt = new Date(review.createdAt).toLocaleString();
          const updatedAt = new Date(review.updatedAt).toLocaleString();

          return {
            ...review,
            courseName: coursesData.find(course => course.courseId === review.courseId)?.courseName || 'Курс не найден',
            parentName: parent ? `${parent.firstName} ${parent.lastName}` : 'Имя родителя не указано',
            childLabel,
            childNameString,
            createdAt,
            updatedAt,
            isUpdated: review.updatedAt !== review.createdAt,
          };
        });

        setReviews(enrichedReviews);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Произошла ошибка при загрузке данных.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndCourses();
  }, []);

  const handleOpen = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReview(null);
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

      let updatedReviews;

      if (selectedReview) {
        await ReviewsService.updateReview(selectedReview.reviewId, newReview);
        alert('Отзыв успешно обновлен');

        updatedReviews = reviews.map(review =>
          review.reviewId === selectedReview.reviewId ? { ...review, ...newReview } : review
        );
      } else {
        const createdReview = await ReviewsService.createReview(courseId, parentId, newReview);
        alert('Отзыв успешно добавлен');

        const parentResponse = await ParentsService.getParents();
        const parentData = parentResponse.data;

        const parentMap = parentData.reduce((map, parent) => {
          map[parent.parentId] = parent;
          return map;
        }, {});

        const parent = parentMap[parentId];
        const children = parent ? parent.children : [];
        const childNames = children.map(child => `${child.firstName} ${child.lastName}`);
        const childLabel = childNames.length > 1 ? 'Ученики:' : 'Ученик:';
        const childNameString = childNames.join(', ');

        updatedReviews = [
          ...reviews,
          {
            ...newReview,
            reviewId: createdReview.data.reviewId,
            date: new Date().toLocaleDateString(),
            parentName: `${parent.firstName} ${parent.lastName}`,
            childLabel,
            childNameString,
            courseName: courses.find(course => course.courseId === courseId)?.courseName || 'Курс не найден',
          },
        ];
      }

      setReviews(updatedReviews);

      setNewReviewText('');
      setSelectedCourseId('');
      setRating(0);
      setSelectedReview(null);
      setShowAddReview(false);
    } catch (err) {
      console.error('Ошибка при добавлении отзыва:', err);
      alert('Произошла ошибка при добавлении отзыва');
    }
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setAnchorEl(null);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOrder === 'high') {
      return b.rating - a.rating;
    }
    if (sortOrder === 'low') {
      return a.rating - b.rating;
    }
    return 0;
  });

  const filteredReviews = sortedReviews.filter(review => {
    const matchesCourse = selectedCourseFilter ? review.courseName === selectedCourseFilter : true;
    return matchesCourse;
  });

  if (loading) return <Typography variant="h6" align="center">Загрузка данных...</Typography>;
  if (error) return <Typography color="error" variant="h6" align="center">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Отзывы о курсах нашего центра
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <FilterListIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleSortOrderChange('high')}>Сначала с высокой оценкой</MenuItem>
          <MenuItem onClick={() => handleSortOrderChange('low')}>Сначала с низкой оценкой</MenuItem>
        </Menu>

        <FormControl fullWidth sx={{ maxWidth: 200 }}>
          <InputLabel>Курс</InputLabel>
          <Select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            label="Курс"
          >
            <MenuItem value="">Все курсы</MenuItem>
            {courses.map(course => (
              <MenuItem key={course.courseId} value={course.courseName}>
                {course.courseName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isAuthenticated && userInfo?.userType === 'parent' && (
        <Box sx={{ mb: 4 }}>
          <Button variant="contained" color="primary" onClick={() => setShowAddReview(!showAddReview)}>
            {showAddReview ? 'Отмена' : 'Добавить отзыв'}
          </Button>
        </Box>
      )}

      {showAddReview && (
        <Box sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
          <Typography variant="h6" gutterBottom>Добавить отзыв</Typography>

          <TextField
            fullWidth
            select
            label="Выберите курс"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            sx={{ mb: 2 }}
          >
            {courses.map(course => (
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
            <Button variant="contained" color="primary" onClick={handleSubmitReview}>
              {selectedReview ? 'Обновить отзыв' : 'Добавить отзыв'}
            </Button>
          </Box>
        </Box>
      )}

      <Grid container spacing={3}>
        {filteredReviews.map((review) => (
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
                  Родитель: {review.parentName || 'Имя родителя'}
                  <div>
                    {review.childLabel} {review.childNameString || 'Имя ребенка'}
                  </div>
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {review.courseName}
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
                  sx={{ textAlign: 'center', mb: 2 }}
                >
                  {review.isUpdated && (
                    <span style={{ marginRight: '5px' }}>Редактирован</span>
                  )}
                  <span>{review.isUpdated ? review.updatedAt : review.createdAt}</span>
                </Typography>
              </div>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleOpen(review)}
                sx={{ marginTop: 'auto', mb: 1 }}
              >
                Подробнее
              </Button>
              {isManagement && (
                <Button
                  variant="outlined"
                  color='error'
                  size="small"
                  onClick={() => onDeleteReview(review)}
                  sx={{ marginTop: 'auto' }}
                >
                  Удалить
                </Button>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {selectedReview && (
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>
            Родитель: {selectedReview.parentName || 'Имя родителя'}
            <div>
              {selectedReview.childLabel} {selectedReview.childNameString || 'Имя ребенка'}
            </div>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6">{selectedReview.courseName}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {selectedReview.reviewText}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Rating value={selectedReview.rating} readOnly precision={0.5} size="small" />
              <Typography variant="caption" sx={{ ml: 1 }}>
                ({selectedReview.rating}/5)
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      )}

    </Container>
  );
};

export default ReviewsPage;
