/*import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const EmployeeAccount = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phoneNumber: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      const employeeId = userInfo?.data?.employeeId || userInfo?.employeeId;
      if (employeeId) {
        try {
          const response = await axios.get(`http://localhost:8080/vunder-kids/employees/get/${employeeId}`);
          setUserData(response.data);
        } catch (error) {
          console.error('Ошибка загрузки данных сотрудника:', error);
        }
      }
    };

    loadUserData();
  }, [userInfo]);

  const handleUpdateUserInfo = async () => {
    const employeeId = userInfo?.data?.employeeId || userInfo?.employeeId;
    if (!employeeId) {
      alert('Ошибка: employeeId не определен');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/vunder-kids/employees/update/${employeeId}`, userData);
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const translateRole = (role) => {
    switch (role) {
      case 'Admin':
        return 'Администратор';
      case 'Teacher':
        return 'Преподаватель';
      default:
        return role;
    }
  };

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
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Должность</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{translateRole(userData.role) || '—'}</TableCell>
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

      <Box sx={{ mt: 3 }}>
        <Button onClick={handleLogout} variant="contained" color="info" sx={{ width: '100%' }}>
          Выйти из аккаунта
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeAccount;*/

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import InputMask from 'react-input-mask';

const EmployeeAccount = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phoneNumber: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      const employeeId = userInfo?.data?.employeeId || userInfo?.employeeId;
      if (employeeId) {
        try {
          const response = await axios.get(`http://localhost:8080/vunder-kids/employees/get/${employeeId}`);
          setUserData(response.data);
        } catch (error) {
          console.error('Ошибка загрузки данных сотрудника:', error);
        }
      }
    };

    loadUserData();
  }, [userInfo]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+375\(29|25|44|33|17\)\d{7}$/; // Пример для формата +375(XX)XXXXXXX
    return phoneRegex.test(phone);
  };

  const handleUpdateUserInfo = async () => {
    const employeeId = userInfo?.data?.employeeId || userInfo?.employeeId;
    if (!employeeId) {
      alert('Ошибка: employeeId не определен');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }
    const cleanUserData = {
      ...userData,
      phoneNumber: userData.phoneNumber.replace(/\D/g, ''),
    };
    try {
      const response = await axios.put(`http://localhost:8080/vunder-kids/employees/update/${employeeId}`, cleanUserData);
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const translateRole = (role) => {
    switch (role) {
      case 'Admin':
        return 'Администратор';
      case 'Teacher':
        return 'Преподаватель';
      default:
        return role;
    }
  };

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
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.02rem' }}>Должность</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{translateRole(userData.role) || '—'}</TableCell>
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
            onChange={(e) => {
              setUserData({ ...userData, email: e.target.value });
              setEmailError(!validateEmail(e.target.value));
            }}
            fullWidth
            margin="normal"
            error={emailError}
            helperText={emailError ? 'Введите корректный email в формате ...@...' : ''}
          />
          <InputMask
            mask="+375(99)999-99-99"
            value={userData.phoneNumber}
            onChange={(e) => {
              setUserData({ ...userData, phoneNumber: e.target.value });
              setPhoneError(!validatePhone(e.target.value));
            }}
          >
            {() => (
              <TextField
                label="Телефон"
                fullWidth
                margin="normal"
                error={phoneError}
                helperText={phoneError ? 'Введите корректный номер телефона в формате +375(XX)XXXXXXX' : ''}
              />
            )}
          </InputMask>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', gap: 1 }}>
            <Button onClick={handleUpdateUserInfo} variant="contained" color="info" sx={{ fontSize: '14px' }} disabled={emailError || phoneError}>
              Сохранить изменения
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outlined" color="info" sx={{ fontSize: '14px' }}>
              Отмена
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Button onClick={handleLogout} variant="contained" color="info" sx={{ width: '100%' }}>
          Выйти из аккаунта
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeAccount;
