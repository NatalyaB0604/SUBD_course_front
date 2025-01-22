import axios from 'axios';

const AUTH_BASE_URL = 'http://localhost:8080/vunder-kids/auth';

const loginParent = async (formData) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, formData, {
      withCredentials: true,
    });
    console.log('Ответ сервера для родителя:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Ошибка при входе родителя:', error);
    if (error.response) {
      return { success: false, message: error.response.data.message };
    } else if (error.request) {
      return { success: false, message: 'Нет ответа от сервера' };
    } else {
      return { success: false, message: 'Произошла ошибка в процессе входа' };
    }
  }
};

const loginEmployee = async (formData) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/login-employee`, formData, {
      withCredentials: true,
    });
    console.log('Ответ сервера для сотрудника:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Ошибка при входе сотрудника:', error);
    if (error.response) {
      return { success: false, message: error.response.data.message };
    } else if (error.request) {
      return { success: false, message: 'Нет ответа от сервера' };
    } else {
      return { success: false, message: 'Произошла ошибка в процессе входа' };
    }
  }
};

const AuthService = {
  loginParent,
  loginEmployee,
};

export default AuthService;
