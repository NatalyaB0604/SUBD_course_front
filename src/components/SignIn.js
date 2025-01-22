/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert, IconButton, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthService from '../services/AuthService';
import { useAuth } from '../components/AuthContext';

const SignIn = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('parent');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response;

    if (userType === 'parent') {
      response = await AuthService.loginParent(formData);
    } else if (userType === 'employee') {
      response = await AuthService.loginEmployee(formData);
    }

    if (userType === 'parent') {
      const { parentId, ...otherData } = response.data;
      login({ parentId, ...otherData, userType });
      navigate('/');
    } else if (userType === 'employee') {
      const { employeeId, ...otherData } = response.data;
      login({ employeeId, ...otherData, userType });
      navigate('/manage-course-info');
    }  else {
      setError(response.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Вход
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <RadioGroup value={userType} onChange={handleUserTypeChange} row>
            <FormControlLabel value="parent" control={<Radio />} label="Родитель" />
            <FormControlLabel value="employee" control={<Radio />} label="Сотрудник детского центра" />
          </RadioGroup>

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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Войти
          </Button>
        </form>

        {userType === 'parent' && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Нет аккаунта?
            <Button onClick={() => navigate('/sign-up')} variant="text">Зарегистрируйтесь</Button>
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default SignIn;*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert, IconButton, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthService from '../services/AuthService';
import { useAuth } from '../components/AuthContext';

const SignIn = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('parent');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (userType === 'parent') {
        response = await AuthService.loginParent(formData);
      } else if (userType === 'employee') {
        response = await AuthService.loginEmployee(formData);
      }

      if (userType === 'parent') {
        const { parentId, ...otherData } = response.data;
        login({ parentId, ...otherData, userType });
        navigate('/');
      } else if (userType === 'employee') {
        const { employeeId, ...otherData } = response.data;
        login({ employeeId, ...otherData, userType });
        navigate('/manage-course-info');
      }
    } catch (error) {
      // Установите сообщение об ошибке, если логин или пароль неверные
      setError('Неправильный логин или пароль');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Вход
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <RadioGroup value={userType} onChange={handleUserTypeChange} row>
            <FormControlLabel value="parent" control={<Radio />} label="Родитель" />
            <FormControlLabel value="employee" control={<Radio />} label="Сотрудник детского центра" />
          </RadioGroup>

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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Войти
          </Button>
        </form>

        {userType === 'parent' && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Нет аккаунта?
            <Button onClick={() => navigate('/sign-up')} variant="text">Зарегистрируйтесь</Button>
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default SignIn;
