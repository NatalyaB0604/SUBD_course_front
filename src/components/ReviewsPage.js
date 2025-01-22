import React, { useEffect, useState } from 'react';
import ReviewsService from '../services/ReviewsService';
import CourseService from '../services/CoursesService';
import ParentsService from '../services/ParentsService';
import SignUpsService from '../services/SignUpsService';
import { Container, Typography, Grid, Box, Button, Dialog, DialogTitle, DialogContent, Rating, IconButton, Menu, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const ReviewsPage = ({ isManagement, onDeleteReview }) => {
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState('');

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

        const signUpsResponse = await SignUpsService.getAllSignUps(); // Fetch sign-ups for children
        const signUpsData = signUpsResponse.data;

        const enrichedReviews = reviewsData.map(review => {
          const parent = parentMap[review.parentId];
          const children = parent ? parent.children : [];

          const enrolledChildren = children.filter(child =>
            signUpsData.some(signUp => signUp.childId === child.childId && signUp.courseId === review.courseId)
          );

          const childLabel = enrolledChildren.length > 1 ? 'Ученики:' : 'Ученик:';
          const childNameString = enrolledChildren.map(child => `${child.firstName} ${child.lastName}`).join(', ') || 'Не указано';

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
