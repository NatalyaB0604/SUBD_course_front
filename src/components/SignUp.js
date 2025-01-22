/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ParentsService from '../services/ParentsService';
import { useAuth } from './AuthContext';

const RegisterParents = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    login: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [setFormError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      checkPasswordMatch(e.target.name === 'password' ? e.target.value : formData.password,
                         e.target.name === 'confirmPassword' ? e.target.value : formData.confirmPassword);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const checkPasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.login ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.email ||
      !formData.phoneNumber
    ) {
      setFormError('Пожалуйста, заполните все поля');
      alert('Пожалуйста, заполните все поля');
      return;
    }

    if (passwordError) {
      alert('Пожалуйста, исправьте ошибки с паролем');
      return;
    }

    try {
      const response = await ParentsService.createParents(formData);
      alert('Регистрация успешна');
      const { parentId, firstName, lastName, email, phoneNumber } = response.data;
      const userInfo = { parentId, firstName, lastName, email, phoneNumber };
      login(userInfo);
      navigate('/');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Ошибка при регистрации');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Регистрация
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="firstName"
            label="Имя"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="lastName"
            label="Фамилия"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="login"
            label="Логин"
            value={formData.login}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="password"
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <TextField
            fullWidth
            name="confirmPassword"
            label="Подтверждение пароля"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={toggleConfirmPasswordVisibility}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="phoneNumber"
            label="Номер телефона"
            value={formData.phoneNumber}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Зарегистрироваться
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Уже зарегистрированы?
          <Button onClick={() => navigate('/sign-in')} variant="text">Войти</Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterParents;*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { TextField, Button, Typography, Container, Box, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ParentsService from '../services/ParentsService';
import { useAuth } from './AuthContext';

const RegisterParents = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    login: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [setFormError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'confirmPassword' || name === 'password') {
      checkPasswordMatch(name === 'password' ? value : formData.password,
        name === 'confirmPassword' ? value : formData.confirmPassword);
    }

    if (name === 'email') {
      validateEmail(value);
    }
  };

  const handlePhoneChange = (formattedValue, rawValue) => {
    setFormData({
      ...formData,
      phoneNumber: rawValue,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const checkPasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
    } else {
      setPasswordError('');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Введите корректный email в формате ...@...');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.login ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.email ||
      !formData.phoneNumber
    ) {
      setFormError('Пожалуйста, заполните все поля');
      alert('Пожалуйста, заполните все поля');
      return;
    }

    if (passwordError || emailError || phoneError) {
      alert('Пожалуйста, исправьте ошибки');
      return;
    }

    const cleanFormData = {
      ...formData,
      phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
    };

    try {
      const response = await ParentsService.createParents(cleanFormData);
      alert('Регистрация успешна');
      const { parentId, firstName, lastName, email, phoneNumber } = response.data;
      const userInfo = { parentId, firstName, lastName, email, phoneNumber };
      login(userInfo);
      navigate('/');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Ошибка при регистрации');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Регистрация
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="firstName"
            label="Имя"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="lastName"
            label="Фамилия"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="login"
            label="Логин"
            value={formData.login}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            name="password"
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <TextField
            fullWidth
            name="confirmPassword"
            label="Подтверждение пароля"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={toggleConfirmPasswordVisibility}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            error={!!emailError}
            helperText={emailError}
          />
          <InputMask
            mask="+375(99)999-99-99"
            value={formData.phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value, e.target.value.replace(/\D/g, ''))}
          >
            {() => (
              <TextField
                fullWidth
                name="phoneNumber"
                label="Номер телефона"
                margin="normal"
                error={!!phoneError}
                helperText={phoneError}
              />
            )}
          </InputMask>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Зарегистрироваться
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Уже зарегистрированы?
          <Button onClick={() => navigate('/sign-in')} variant="text">Войти</Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterParents;
