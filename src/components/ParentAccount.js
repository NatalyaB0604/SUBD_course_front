import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Button, Box, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const ParentAccount = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    children: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [childForm, setChildForm] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [childToDelete, setChildToDelete] = useState(null);
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      console.log('userInfo', userInfo);
      const parentId = userInfo?.data?.parentId || userInfo?.parentId;
      if (parentId) {
        try {
          const response = await axios.get(`http://localhost:8080/vunder-kids/parents/get/${parentId}?timestamp=${new Date().getTime()}`);
          setUserData(response.data);
        } catch (error) {
          console.error('Ошибка загрузки данных пользователя:', error);
        }
      }
    };

    loadUserData();
  }, [userInfo]);

  const handleUpdateUserInfo = async () => {
    const parentId = userInfo?.data?.parentId || userInfo?.parentId;
    if (!parentId) {
      alert('Ошибка: parentId не определен');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/vunder-kids/parents/update/${parentId}`, userData);
      if (response.status === 200) {
        alert('Информация успешно обновлена');
        setIsEditing(false);
      } else {
        alert('Не удалось обновить информацию');
      }
    } catch (error) {
      console.error('Ошибка обновления информации:', error);
      alert('Ошибка обновления информации');
    }
  };

  const handleAddOrEditChild = async () => {
    const parentId = userInfo?.data?.parentId || userInfo?.parentId;
    if (!parentId || !childForm) return;

    if (!childForm.firstName || !childForm.lastName || !childForm.birthDate) {
      alert('Пожалуйста, заполните все поля информации о ребенке.');
      return;
    }

    const birthDate = new Date(childForm.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const monthDiff = new Date().getMonth() - birthDate.getMonth();
    if (age > 16 || (age === 16 && monthDiff > 0)) {
      alert('Ребенок должен быть 16 лет или младше.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/vunder-kids/children/save/${parentId}`, childForm);
      if (response.status === 201) {
        alert('Ребенок добавлен успешно');
        const updatedResponse = await axios.get(`http://localhost:8080/vunder-kids/parents/get/${parentId}?timestamp=${new Date().getTime()}`);
        console.log('Updated User Data:', updatedResponse.data);
        setUserData(updatedResponse.data);
        setChildForm(null);
      } else {
        alert('Не удалось сохранить данные ребенка');
      }
    } catch (error) {
      console.error('Ошибка сохранения данных ребенка:', error);
      alert('Ошибка сохранения данных ребенка');
    }
  };

  const handleDeleteChild = (childId) => {
    setChildToDelete(childId);
    setConfirmDelete(true);
  };

  const confirmDeleteChild = async () => {
    try {
      await axios.delete(`http://localhost:8080/vunder-kids/children/delete/${childToDelete}`);
      alert('Ребенок удален успешно');
      setUserData((prevData) => ({
        ...prevData,
        children: prevData.children.filter((child) => child.childId !== childToDelete),
      }));
    } catch (error) {
      console.error('Ошибка удаления ребенка:', error);
      alert('Ошибка удаления ребенка');
    } finally {
      setConfirmDelete(false);
      setChildToDelete(null);
    }
  };

  const handleLogoutConfirmation = () => {
    const confirmed = window.confirm('Вы уверены, что хотите выйти из аккаунта?');
    if (confirmed) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentYear = new Date().getFullYear();
  const minBirthDate = '2008-01-01';
  const maxBirthDate = `${currentYear}-12-31`;

  return (
    <Box sx={{ p: 3, maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h4" component="h1" textAlign="center">Мой профиль</Typography>

      {!isEditing ? (
        <TableContainer sx={{ mt: 3 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Имя</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{userData.firstName || '—'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Фамилия</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{userData.lastName || '—'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Email</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{userData.email || '—'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Телефон</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{userData.phoneNumber || '—'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <Button onClick={() => setIsEditing(true)} variant="contained" color="info" sx={{ fontSize: '14px' }}>
              Изменить личную информацию
            </Button>
          </Box>
        </TableContainer>
      ) : (
        <Box sx={{ mt: 3 }}>
          <TextField
            label="Имя"
            value={userData.firstName}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Фамилия"
            value={userData.lastName}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Телефон"
            value={userData.phoneNumber}
            onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
            fullWidth
            margin="normal"
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', gap: 1 }}>
            <Button onClick={handleUpdateUserInfo} variant="contained" color="info" sx={{ fontSize: '14px' }}>
              Сохранить изменения
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outlined" color="info" sx={{ fontSize: '14px' }}>
              Отмена
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Дети</Typography>
        {userData.children.length ? (
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Имя</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Фамилия</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Дата рождения</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Действия</TableCell>
                </TableRow>
                {userData.children.map((child) => (
                  <TableRow key={child.childId}>
                    <TableCell sx={{ fontSize: '1rem' }}>{child.firstName || '—'}</TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>{child.lastName || '—'}</TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>
                      {child.birthDate ? new Date(child.birthDate).toLocaleDateString('ru-RU') : '—'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button onClick={() => setChildForm(child)} variant="contained" color="info" size="small">
                          Изменить
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleDeleteChild(child.childId)}
                          variant="outlined"
                          size="small"
                        >
                          Удалить
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Нет данных о детях</Typography>
        )}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            color="info"
            onClick={() => setChildForm({ firstName: '', lastName: '', birthDate: '' })}
          >
            Добавить ребенка
          </Button>
        </Box>
      </Box>

      {childForm && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">{childForm.childId ? 'Изменение данных о ребенке' : 'Добавление ребенка'}</Typography>
          <TextField
            label="Имя"
            value={childForm.firstName}
            onChange={(e) => setChildForm({ ...childForm, firstName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Фамилия"
            value={childForm.lastName}
            onChange={(e) => setChildForm({ ...childForm, lastName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Дата рождения"
            type="date"
            value={childForm.birthDate ? new Date(childForm.birthDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setChildForm({ ...childForm, birthDate: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minBirthDate, max: maxBirthDate }} // Set min and max attributes
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" color="info" onClick={handleAddOrEditChild}>
              {childForm.childId ? 'Сохранить изменения' : 'Добавить'}
            </Button>
            <Button variant="outlined" color="info" sx={{ fontSize: '14px' }} onClick={() => setChildForm(null)}>
              Отмена
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Button onClick={handleLogoutConfirmation} variant="contained" color="info" sx={{ width: '100%' }}>
          Выйти из аккаунта
        </Button>
      </Box>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить информацию о ребенке?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="info">
            Отмена
          </Button>
          <Button onClick={confirmDeleteChild} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParentAccount;
