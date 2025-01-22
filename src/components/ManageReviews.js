import React, { useEffect, useState } from 'react';
import ReviewsPage from './ReviewsPage';
import ReviewsService from '../services/ReviewsService';
import { Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useAuth } from './AuthContext';

const ManageReviews = () => {
  const { userInfo } = useAuth();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const reviewsResponse = await ReviewsService.getAllReviews();
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Произошла ошибка при загрузке данных.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async () => {
    try {
      await ReviewsService.deleteReview(selectedReview.reviewId);
      setReviews(reviews.filter(review => review.reviewId !== selectedReview.reviewId));
      setOpenDeleteDialog(false);
      setSelectedReview(null);
    } catch (err) {
      console.error('Ошибка при удалении отзыва:', err);
      alert('Произошла ошибка при удалении отзыва');
    }
  };

  if (loading) {
    return <Typography variant="h6" align="center">Загрузка данных...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {userInfo?.userType === 'employee' ? (
        <ReviewsPage
          isManagement
          onDeleteReview={(review) => {
            setSelectedReview(review);
            setOpenDeleteDialog(true);
          }}
        />
      ) : (
        <Typography variant="h6" align="center">
          У вас нет доступа к этому разделу.
        </Typography>
      )}

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} fullWidth>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить этот отзыв?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Отмена</Button>
          <Button onClick={handleDeleteReview} color="primary">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageReviews;
