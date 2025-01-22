/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CoursesService from '../services/CoursesService';
import CourseAdvantagesService from '../services/CourseAdvantagesService';
import AgeCategoryService from '../services/AgeCategoryService';
import ReviewsService from '../services/ReviewsService';
import ParentsService from '../services/ParentsService';
import { Container, Grid, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Rating, Dialog, DialogTitle, DialogContent, Menu, MenuItem, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAuth } from './AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [advantages, setAdvantages] = useState([]);
  const [ageCategory, setAgeCategory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReviewText, setNewReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [sortOrder, setSortOrder] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, userInfo } = useAuth();
  const [parentMap, setParentMap] = useState({});
  const [showReviewInput, setShowReviewInput] = useState(false);

  useEffect(() => {
    const fetchCourseAndAdvantages = async () => {
      try {
        const courseResponse = await CoursesService.getCoursesById(id);
        setCourse(courseResponse.data);

        const advantagesResponse = await CourseAdvantagesService.getCourseAdvantagesByCourseId(id);
        setAdvantages(advantagesResponse.data);

        const ageCategoryResponse = await AgeCategoryService.getAgeCategoryByCourseId(id);
        setAgeCategory(ageCategoryResponse.data);

        const reviewsResponse = await ReviewsService.getReviewByCourseId(id);
        const reviewsData = reviewsResponse.data;

        const parentResponse = await ParentsService.getParents();
        const parentData = parentResponse.data;

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

          return {
            ...review,
            parentName: parent ? `${parent.firstName} ${parent.lastName}` : 'Имя родителя не указано',
            childLabel,
            childNameString,
            date: new Date(review.createdAt).toLocaleDateString(),
            rating: Number(review.rating),
          };
        });

        setReviews(enrichedReviews);
        setParentMap(parentMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndAdvantages();
  }, [id]);

  const handleOpen = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReview(null);
  };

  const handleSubmitReview = async () => {
    if (!newReviewText.trim() || rating === 0) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const parentId = userInfo?.data?.parentId;

      const newReview = {
        parentId: parentId || null,
        courseId: id,
        reviewText: newReviewText.trim(),
        rating,
      };

      await ReviewsService.createReview(id, parentId, newReview);
      alert('Отзыв успешно добавлен');

      const parent = parentMap[parentId];
      const children = parent ? parent.children : [];
      const childNames = children.map(child => `${child.firstName} ${child.lastName}`);
      const childLabel = childNames.length > 1 ? 'Ученики:' : 'Ученик:';
      const childNameString = childNames.join(', ');

      const enrichedReview = {
        ...newReview,
        parentName: parent ? `${parent.firstName} ${parent.lastName}` : 'Имя родителя не указано',
        childLabel,
        childNameString,
        date: new Date().toLocaleDateString(),
      };

      setReviews((prevReviews) => [...prevReviews, enrichedReview]);
      setNewReviewText('');
      setRating(0);
      setShowReviewInput(false);
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

  if (loading) return <Typography variant="h6" align="center">Загрузка данных...</Typography>;
  if (error) return <Typography color="error" variant="h6" align="center">{error}</Typography>;

  const abonnementOrder = [
    "2 раза в неделю",
    "1 раз в неделю",
    "Пробное",
    "Разовое"
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {course?.courseName || 'Без названия'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {course?.courseDescription || 'Описание отсутствует'}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        {course?.courseImage && (
          <img
            src={process.env.PUBLIC_URL + course.courseImage}
            alt={course.courseName}
            style={{ width: '100%', maxWidth: '600px', objectFit: 'cover', borderRadius: '8px' }}
          />
        )}
      </Box>

      <Typography variant="h5" component="h2" gutterBottom>
        Преимущества курса
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {advantages.length > 0 ? (
          advantages.map((advantage) => (
            <Grid item xs={12} sm={6} md={4} key={advantage.id}>
              <Card sx={{ textAlign: 'center', p: 2, height: '150px' }}>
                <CheckCircleIcon color="primary" fontSize="large" />
                <CardContent>
                  <Typography variant="h6">{advantage.advantageName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {advantage.advantageDescription}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>Преимущества отсутствуют</Typography>
        )}
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Возрастные группы
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {ageCategory.length > 0 ? (
          [...ageCategory]
            .sort((a, b) => a.startAge - b.startAge)
            .map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card sx={{ p: 2, height: '105px' }}>
                  <Typography variant="h6">
                    Для возраста {category.startAge} - {category.endAge} {category.endAge >= 1 && category.endAge <= 4 ? "года" : "лет"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {category.description}
                  </Typography>
                </Card>
              </Grid>
            ))
        ) : (
          <Typography>Возрастные группы отсутствуют</Typography>
        )}
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Стоимость занятий
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {course?.coursePricing && course.coursePricing.length > 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 2, maxWidth: '800px', boxShadow: 2 }}>
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
                    .map((pricing, index) => {
                      const totalMonthlyCost = (pricing.pricePerClass * pricing.classesPerMonth).toFixed(2);
                      const isLastRow = index === course.coursePricing.length - 1;
                      return (
                        <TableRow key={pricing.id}
                          sx={{
                            borderBottom: isLastRow ? 'none' : '1px solid rgba(224, 224, 224, 1)',
                          }}>
                          <TableCell sx={{ fontSize: '1rem' }}>
                            {pricing.abonnementType} {pricing.abonnementType !== 'Разовое' && pricing.abonnementType !== 'Пробное' && (
                              `(абон. ${pricing.classesPerMonth} занятий)`
                            )}
                          </TableCell>
                          <TableCell>{pricing.pricePerClass.toFixed(2)} BYN</TableCell>
                          <TableCell>
                            {pricing.abonnementType !== 'Разовое' && pricing.abonnementType !== 'Пробное'
                              ? `${pricing.pricePerClass.toFixed(2)} x ${pricing.classesPerMonth} = ${totalMonthlyCost} BYN`
                              : `${totalMonthlyCost} BYN`}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Card>
          </Grid>
        ) : (
          <Typography>Стоимость занятий не указана</Typography>
        )}
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Отзывы о курсе
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
      </Box>

      {isAuthenticated && userInfo?.userType === 'parent' && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowReviewInput((prev) => !prev)}
            sx={{ mb: 2 }}
          >
            {showReviewInput ? 'Отмена' : 'Добавить отзыв'}
          </Button>

          {showReviewInput && (
            <Box sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: '8px', boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom>Добавить отзыв</Typography>
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
                onChange={(event, newValue) => setRating(newValue)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSubmitReview}>
                  Добавить отзыв
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}

      <Grid container spacing={3}>
        {sortedReviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review.reviewId}>
            <Box
              sx={{
                boxShadow: 2,
                p: 3,
                textAlign: 'center',
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
                  sx={{ display: 'block', textAlign: 'center', mb: 2 }}
                >
                  {review.date}
                </Typography>
              </div>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSelectedReview(review);
                  setOpenDialog(true);
                }}
                sx={{ marginTop: 'auto' }}
              >
                Подробнее
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      {selectedReview && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
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

export default CourseDetails;
*/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CoursesService from '../services/CoursesService';
import CourseAdvantagesService from '../services/CourseAdvantagesService';
import AgeCategoryService from '../services/AgeCategoryService';
import ReviewsService from '../services/ReviewsService';
import ParentsService from '../services/ParentsService';
import SignUpsService from '../services/SignUpsService';
import { Container, Grid, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Rating, Dialog, DialogTitle, DialogContent, Menu, MenuItem, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAuth } from './AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [advantages, setAdvantages] = useState([]);
  const [ageCategory, setAgeCategory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReviewText, setNewReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [sortOrder, setSortOrder] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, userInfo } = useAuth();
  const [parentMap, setParentMap] = useState({});
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [hasConfirmedSignUp, setHasConfirmedSignUp] = useState(false);

  useEffect(() => {
    const fetchCourseAndAdvantages = async () => {
      try {
        const courseResponse = await CoursesService.getCoursesById(id);
        setCourse(courseResponse.data);

        const advantagesResponse = await CourseAdvantagesService.getCourseAdvantagesByCourseId(id);
        setAdvantages(advantagesResponse.data);

        const ageCategoryResponse = await AgeCategoryService.getAgeCategoryByCourseId(id);
        setAgeCategory(ageCategoryResponse.data);

        const reviewsResponse = await ReviewsService.getReviewByCourseId(id);
        const reviewsData = reviewsResponse.data;

        const parentResponse = await ParentsService.getParents();
        const parentData = parentResponse.data;

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

          return {
            ...review,
            parentName: parent ? `${parent.firstName} ${parent.lastName}` : 'Имя родителя не указано',
            childLabel,
            childNameString,
            date: new Date(review.createdAt).toLocaleDateString(),
            rating: Number(review.rating),
          };
        });

        const departmentResponse = await CoursesService.getDepartmentsByCourseId(id);
        setDepartments(departmentResponse.data);

        setReviews(enrichedReviews);
        setParentMap(parentMap);

        if (userInfo?.data?.parentId) {
          const signUpsResponse = await SignUpsService.getSignUpsByParentId(userInfo.data.parentId);
          const confirmedSignUps = signUpsResponse.data.filter(signUp => signUp.courseId === id && signUp.status === 'CONFIRMED');
          setHasConfirmedSignUp(confirmedSignUps.length > 0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndAdvantages();
  }, [id, userInfo]);

  const handleSubmitReview = async () => {
    if (!newReviewText.trim() || rating === 0) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const parentId = userInfo?.data?.parentId;

      const newReview = {
        parentId: parentId || null,
        courseId: id,
        reviewText: newReviewText.trim(),
        rating,
      };

      await ReviewsService.createReview(id, parentId, newReview);
      alert('Отзыв успешно добавлен');

      const parent = parentMap[parentId];
      const children = parent ? parent.children : [];
      const childNames = children.map(child => `${child.firstName} ${child.lastName}`);
      const childLabel = childNames.length > 1 ? 'Ученики:' : 'Ученик:';
      const childNameString = childNames.join(', ');

      const enrichedReview = {
        ...newReview,
        parentName: parent ? `${parent.firstName} ${parent.lastName}` : 'Имя родителя не указано',
        childLabel,
        childNameString,
        date: new Date().toLocaleDateString(),
      };

      setReviews((prevReviews) => [...prevReviews, enrichedReview]);
      setNewReviewText('');
      setRating(0);
      setShowReviewInput(false);
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

  if (loading) return <Typography variant="h6" align="center">Загрузка данных...</Typography>;
  if (error) return <Typography color="error" variant="h6" align="center">{error}</Typography>;

  const abonnementOrder = [
    "2 раза в неделю",
    "1 раз в неделю",
    "Пробное",
    "Разовое"
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {course?.courseName || 'Без названия'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {course?.courseDescription || 'Описание отсутствует'}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        {course?.courseImage && (
          <img
            src={process.env.PUBLIC_URL + course.courseImage}
            alt={course.courseName}
            style={{ width: '100%', maxWidth: '600px', objectFit: 'cover', borderRadius: '8px' }}
          />
        )}
      </Box>

      <Box sx={{ backgroundColor: '#fff', boxShadow: 2, p: 2, borderRadius: '8px', mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Дата курса
        </Typography>
        {course?.startDate ? (
          <>
            <Typography variant="body1" color="textSecondary">
              Начало: {new Date(course.startDate).toLocaleDateString()}
            </Typography>
            {new Date(course.startDate) <= new Date() ? (
              <Typography variant="body1" color="error">
                Курс уже начался
              </Typography>
            ) : (
              <>
                <Typography variant="body1" color="textSecondary">
                  Окончание: {new Date(course.endDate).toLocaleDateString() || 'Дата окончания не указана'}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Количество мест: {course.availableSpots || 'Количество не указано'}
                </Typography>
              </>
            )}
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">Дата начала не указана</Typography>
        )}
      </Box>

      <Typography variant="h5" component="h2" gutterBottom>
        Филиалы, предлагающие этот курс
      </Typography>
      {departments.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {departments.map(branch => (
            <Grid item xs={12} sm={6} md={4} key={branch.departmentId}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">
                  {branch.address}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Филиалы не найдены</Typography>
      )}

      <Typography variant="h5" component="h2" gutterBottom>
        Преимущества курса
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {advantages.length > 0 ? (
          advantages.map((advantage) => (
            <Grid item xs={12} sm={6} md={4} key={advantage.id}>
              <Card sx={{ textAlign: 'center', p: 2, height: '150px' }}>
                <CheckCircleIcon color="primary" fontSize="large" />
                <CardContent>
                  <Typography variant="h6">{advantage.advantageName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {advantage.advantageDescription}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>Преимущества отсутствуют</Typography>
        )}
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Возрастные группы
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {ageCategory.length > 0 ? (
          [...ageCategory]
            .sort((a, b) => a.startAge - b.startAge)
            .map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card sx={{ p: 2, height: '105px' }}>
                  <Typography variant="h6">
                    Для возраста {category.startAge} - {category.endAge} {category.endAge >= 1 && category.endAge <= 4 ? "года" : "лет"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {category.description}
                  </Typography>
                </Card>
              </Grid>
            ))
        ) : (
          <Typography>Возрастные группы отсутствуют</Typography>
        )}
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Стоимость занятий
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {course?.coursePricing && course.coursePricing.length > 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 2, maxWidth: '800px', boxShadow: 2 }}>
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
                    .map((pricing, index) => {
                      const totalMonthlyCost = (pricing.pricePerClass * pricing.classesPerMonth).toFixed(2);
                      const isLastRow = index === course.coursePricing.length - 1;
                      return (
                        <TableRow key={pricing.id}
                          sx={{
                            borderBottom: isLastRow ? 'none' : '1px solid rgba(224, 224, 224, 1)',
                          }}>
                          <TableCell sx={{ fontSize: '1rem' }}>
                            {pricing.abonnementType} {pricing.abonnementType !== 'Разовое' && pricing.abonnementType !== 'Пробное' && (
                              `(абон. ${pricing.classesPerMonth} занятий)`
                            )}
                          </TableCell>
                          <TableCell>{pricing.pricePerClass.toFixed(2)} BYN</TableCell>
                          <TableCell>
                            {pricing.abonnementType !== 'Разовое' && pricing.abonnementType !== 'Пробное'
                              ? `${pricing.pricePerClass.toFixed(2)} x ${pricing.classesPerMonth} = ${totalMonthlyCost} BYN`
                              : `${totalMonthlyCost} BYN`}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Card>
          </Grid>
        ) : (
          <Typography>Стоимость занятий не указана</Typography>
        )}
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Отзывы о курсе
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
      </Box>

      <Grid container spacing={3}>
        {sortedReviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review.reviewId}>
            <Box
              sx={{
                boxShadow: 2,
                p: 3,
                textAlign: 'center',
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
                  sx={{ display: 'block', textAlign: 'center', mb: 2 }}
                >
                  {review.date}
                </Typography>
              </div>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSelectedReview(review);
                  setOpenDialog(true);
                }}
                sx={{ marginTop: 'auto' }}
              >
                Подробнее
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      {selectedReview && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
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

export default CourseDetails;
