import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAuth } from './AuthContext';
import Grid from '@mui/material/Grid';
import SignUpsService from '../services/SignUpsService';
import SignUpToCourse from './SignUpToCourse';
import ConfirmationDialog from './ConfirmationDialog';

const ParentSignUps = () => {
  const { userInfo } = useAuth();
  const [signUps, setSignUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSignUp, setSelectedSignUp] = useState(null);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  useEffect(() => {
    const fetchSignUps = async () => {
      if (!userInfo?.data?.parentId) {
        setLoading(false);
        return;
      }

      try {
        const response = await SignUpsService.getSignUpsByParentId(userInfo.data.parentId);

        if (!Array.isArray(response.data)) {
          throw new Error('Ответ API не является массивом');
        }

        const signUpsWithDetails = await Promise.all(response.data.map(async (signUp) => {
          const childResponse = await SignUpsService.getChildById(signUp.childId);
          const courseResponse = await SignUpsService.getCourseById(signUp.courseId);
          return {
            ...signUp,
            firstName: childResponse.data.firstName,
            lastName: childResponse.data.lastName,
            courseName: courseResponse.data.courseName
          };
        }));

        setSignUps(signUpsWithDetails);
      } catch (error) {
        setErrorMessage('Не удалось загрузить записи: ' + error.message);
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignUps();
  }, [userInfo]);

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Ожидание';
      case 'CONFIRMED':
        return 'Подтверждено';
      case 'CANCELED':
        return 'Отменено';
      default:
        return status;
    }
  };

  const handleOpenDialog = (signUp) => {
    setSelectedSignUp(signUp);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSignUp(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      case 'PENDING':
        return 'blue';
      default:
        return 'black';
    }
  };

  const handleSuccessfulSignUp = () => {
    setShowSignUpForm(false);
  };

  const handleCancel = (signUpId) => {
    setSelectedSignUp(signUpId);
    setConfirmCancelOpen(true);
  };

  const confirmCancelSignUp = async () => {
    if (!selectedSignUp) return;

    try {
      await SignUpsService.deleteSignUp(selectedSignUp);
      setSignUps(signUps.filter((signUp) => signUp.signUpId !== selectedSignUp));
    } catch (error) {
      setErrorMessage('Не удалось отменить запись: ' + error.message);
    } finally {
      setConfirmCancelOpen(false);
      setSelectedSignUp(null);
    }
  };

  const toggleSignUpForm = () => {
    setShowSignUpForm((prev) => !prev);
  };

  if (loading) {
    return <Typography>Загрузка...</Typography>;
  }

  if (errorMessage) {
    return <Typography color="error">{errorMessage}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom textAlign={'center'} >Записи на курсы и кружки</Typography>
      <TableContainer>
        <Table sx={{ border: '1px solid #ddd' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.02rem', border: '1px solid #ddd', width: '20%' }}>Имя ребенка</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.02rem', border: '1px solid #ddd', width: '20%' }}>Фамилия ребенка</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.02rem', border: '1px solid #ddd', width: '20%' }}>Курс</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.02rem', border: '1px solid #ddd', width: '20%' }}>Статус</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.02rem', border: '1px solid #ddd', width: '20%' }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {signUps.map((signUp) => (
              <TableRow key={signUp.signUpId}>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd' }}>{signUp.firstName}</TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd' }}>{signUp.lastName}</TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd' }}>{signUp.courseName}</TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd' }}>{translateStatus(signUp.status)}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button variant="contained" color="info" onClick={() => handleOpenDialog(signUp)} sx={{ width: '120px' }}>Подробнее</Button>
                    {signUp.status === 'PENDING' && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleCancel(signUp.signUpId)}
                        sx={{ mt: 2, width: '120px' }}
                      >
                        Отменить запись
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ '& .MuiDialog-paper': { width: '400px', maxHeight: '90%' } }}>
        <DialogContent>
          {selectedSignUp && (
            <>
              <Typography variant="h6" align="center" fontWeight='bold'>Информация о записи</Typography>
              <Typography sx={{ mt: 2 }}><strong>Имя ребенка:</strong> {selectedSignUp.firstName}</Typography>
              <Typography><strong>Фамилия ребенка:</strong> {selectedSignUp.lastName}</Typography>
              <Typography><strong>Курс:</strong> {selectedSignUp.courseName}</Typography>
              <Typography>
                <strong>Статус:</strong>
                <span style={{ color: getStatusColor(selectedSignUp.status), marginLeft: '5px' }}>
                  {translateStatus(selectedSignUp.status)}
                </span>
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseDialog} variant="contained" color="primary" sx={{ width: '100px' }}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        onConfirm={confirmCancelSignUp}
        message="Вы уверены, что хотите отменить запись?"
      />

      {userInfo && userInfo.data && (
        <Grid item xs={12} sx={{ mt: 4, textAlign: 'center' }}>
          {!showSignUpForm ? (
            <Button variant="contained" size="large" onClick={toggleSignUpForm}>Записаться на курс</Button>
          ) : (
            <>
              <SignUpToCourse onSuccessfulSignUp={handleSuccessfulSignUp} />
              <Button variant="outlined" color="info" size="large" onClick={toggleSignUpForm}>Отмена</Button>
            </>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default ParentSignUps;
