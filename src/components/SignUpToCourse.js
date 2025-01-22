/*import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import CoursesService from '../services/CoursesService';
import ParentsService from '../services/ParentsService';
import SignUpsService from '../services/SignUpsService';

const SignUpToCourse = ({ onSuccessfulSignUp }) => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [formData, setFormData] = useState({
    parentName: '',
    parentSurname: '',
    parentPhone: '',
    parentEmail: '',
    childName: '',
    childSurname: '',
    childDOB: '',
    childAge: ''
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingSignUps, setExistingSignUps] = useState([]);

  useEffect(() => {
    const fetchParentData = async () => {
      if (!userInfo) return;
      try {
        const parentId = userInfo.data.parentId;
        const parentResponse = await ParentsService.getParents();
        const parentData = parentResponse.data.find((parent) => parent.parentId === parentId);

        if (parentData) {
          setFormData({
            parentName: parentData.firstName,
            parentSurname: parentData.lastName,
            parentPhone: parentData.phoneNumber || '',
            parentEmail: parentData.email || ''
          });
          setChildren(parentData.children || []);
        } else {
          setErrorMessage('Родитель не найден.');
        }
      } catch (error) {
        setErrorMessage('Не удалось загрузить данные родителя.');
      }
    };

    const fetchCourses = async () => {
      try {
        const coursesResponse = await CoursesService.getCourses();
        setCourses(coursesResponse.data);
      } catch (error) {
        setErrorMessage('Не удалось загрузить курсы.');
      }
    };

    const fetchSignUps = async () => {
      try {
        const parentId = userInfo.data.parentId;
        const signUpsResponse = await SignUpsService.getSignUpsByParentId(parentId);
        setExistingSignUps(signUpsResponse.data);
      } catch (error) {
        setErrorMessage('Не удалось загрузить записи.');
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchParentData(), fetchCourses(), fetchSignUps()]);
      setLoading(false);
    };

    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);

  const handleChildSelect = (e) => {
    const selectedChildId = e.target.value;
    setSelectedChildId(selectedChildId);

    const selectedChild = children.find(child => child.childId === selectedChildId);
    if (selectedChild) {
      const childAge = calculateAge(selectedChild.birthDate);
      setFormData({
        ...formData,
        childName: selectedChild.firstName,
        childSurname: selectedChild.lastName,
        childDOB: selectedChild.birthDate,
        childAge: childAge
      });
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSignUp = async () => {
    const parentId = userInfo.data.parentId;

    if (!parentId || !selectedCourseId || !selectedChildId) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const alreadySignedUp = existingSignUps.some(signUp =>
      signUp.childId === selectedChildId &&
      signUp.courseId === selectedCourseId &&
      signUp.status == 'PENDING'
    );

    if (alreadySignedUp) {
      alert('Вы уже записали ребенка на данный курс. Запись в ожидании.');
      return;
    }

    const signUpData = {
      courseId: selectedCourseId,
      parentId: parentId,
      childId: selectedChildId,
    };

    try {
      const response = await SignUpsService.createSignUp(
        selectedCourseId,
        parentId,
        selectedChildId,
        signUpData
      );
      if (response.status === 200 || response.status === 201) {
        alert('Вы успешно записались на курс!');

        setCourses((prevCourses) => prevCourses.filter(course => course.courseId !== selectedCourseId));

        navigate('/');
        setSelectedCourseId('');
        setSelectedChildId('');
        onSuccessfulSignUp();
      } else {
        alert('Произошла ошибка при записи на курс.');
      }
    } catch (error) {
      alert('Не удалось записаться на курс.');
    }
  };

  const filteredCourses = courses.filter(course =>
    !existingSignUps.some(signUp =>
      signUp.childId === selectedChildId &&
      signUp.courseId === course.courseId &&
      signUp.status === 'CONFIRMED')
  );

  if (loading) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        maxWidth: '500px',
        mx: 'auto',
      }}
    >
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      <TextField
        label="Имя родителя"
        value={formData.parentName}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Фамилия родителя"
        value={formData.parentSurname}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Контактный телефон"
        value={formData.parentPhone}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="E-mail"
        value={formData.parentEmail}
        fullWidth
        sx={{ mb: 3 }}
      />
      {children.length > 0 ? (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Выберите ребенка</InputLabel>
          <Select
            value={selectedChildId}
            onChange={handleChildSelect}
            label="Выберите ребенка"
            sx={{ textAlign: 'center' }}
          >
            {children.map((child) => (
              <MenuItem key={child.childId} value={child.childId}>
                {child.firstName} {child.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          У вас нет детей для записи. Добавьте их в личном кабинете.
        </Typography>
      )}

      <TextField
        label="Имя ребенка"
        value={formData.childName}
        InputLabelProps={{
          shrink: !!formData.childName,
        }}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Фамилия ребенка"
        value={formData.childSurname}
        InputLabelProps={{
          shrink: !!formData.childSurname,
        }}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Дата рождения ребенка"
        value={formData.childDOB}
        InputLabelProps={{
          shrink: !!formData.childDOB,
        }}
        fullWidth
        sx={{ mb: 3 }}
      />

      {formData.childAge && (
        <Typography sx={{ mb: 3 }}>
          <strong>Возраст ребенка:</strong> {formData.childAge} лет
        </Typography>
      )}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Выберите курс</InputLabel>
        <Select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          label="Выберите курс"
          sx={{ textAlign: 'center' }}
        >
          {filteredCourses.map((course) => (
            <MenuItem key={course.courseId} value={course.courseId}>
              {course.courseName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleSignUp}
        disabled={!selectedChildId || !selectedCourseId}
        sx={{ width: '100%' }}
      >
        Записаться
      </Button>
    </Box>
  );
};

export default SignUpToCourse;*/

import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import CoursesService from '../services/CoursesService';
import ParentsService from '../services/ParentsService';
import SignUpsService from '../services/SignUpsService';

const SignUpToCourse = ({ onSuccessfulSignUp }) => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [formData, setFormData] = useState({
    parentName: '',
    parentSurname: '',
    parentPhone: '',
    parentEmail: '',
    childName: '',
    childSurname: '',
    childDOB: '',
    childAge: ''
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingSignUps, setExistingSignUps] = useState([]);

  useEffect(() => {
    const fetchParentData = async () => {
      if (!userInfo) return;
      try {
        const parentId = userInfo.data.parentId;
        const parentResponse = await ParentsService.getParents();
        const parentData = parentResponse.data.find((parent) => parent.parentId === parentId);

        if (parentData) {
          setFormData({
            parentName: parentData.firstName,
            parentSurname: parentData.lastName,
            parentPhone: parentData.phoneNumber || '',
            parentEmail: parentData.email || ''
          });
          setChildren(parentData.children || []);
        } else {
          setErrorMessage('Родитель не найден.');
        }
      } catch (error) {
        setErrorMessage('Не удалось загрузить данные родителя.');
      }
    };

    const fetchCourses = async () => {
      try {
        const coursesResponse = await CoursesService.getCourses();
        setCourses(coursesResponse.data);
      } catch (error) {
        setErrorMessage('Не удалось загрузить курсы.');
      }
    };

    const fetchSignUps = async () => {
      try {
        const parentId = userInfo.data.parentId;
        const signUpsResponse = await SignUpsService.getSignUpsByParentId(parentId);
        setExistingSignUps(signUpsResponse.data);
      } catch (error) {
        setErrorMessage('Не удалось загрузить записи.');
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchParentData(), fetchCourses(), fetchSignUps()]);
      setLoading(false);
    };

    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);

  const handleChildSelect = (e) => {
    const selectedChildId = e.target.value;
    setSelectedChildId(selectedChildId);

    const selectedChild = children.find(child => child.childId === selectedChildId);
    if (selectedChild) {
      const childAge = calculateAge(selectedChild.birthDate);
      setFormData({
        ...formData,
        childName: selectedChild.firstName,
        childSurname: selectedChild.lastName,
        childDOB: selectedChild.birthDate,
        childAge: childAge
      });
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSignUp = async () => {
    const parentId = userInfo.data.parentId;

    if (!parentId || !selectedCourseId || !selectedChildId) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const alreadySignedUp = existingSignUps.some(signUp =>
      signUp.childId === selectedChildId &&
      signUp.courseId === selectedCourseId &&
      signUp.status === 'PENDING'
    );

    if (alreadySignedUp) {
      alert('Вы уже записали ребенка на данный курс. Запись в ожидании.');
      return;
    }

    const signUpData = {
      courseId: selectedCourseId,
      parentId: parentId,
      childId: selectedChildId,
    };

    try {
      const response = await SignUpsService.createSignUp(
        selectedCourseId,
        parentId,
        selectedChildId,
        signUpData
      );
      if (response.status === 200 || response.status === 201) {
        alert('Вы успешно записались на курс!');

        setCourses((prevCourses) => prevCourses.filter(course => course.courseId !== selectedCourseId));

        navigate('/');
        setSelectedCourseId('');
        setSelectedChildId('');
        onSuccessfulSignUp();
      } else {
        alert('Произошла ошибка при записи на курс.');
      }
    } catch (error) {
      alert('Не удалось записаться на курс.');
    }
  };

  const filteredCourses = courses.filter(course =>
    !existingSignUps.some(signUp =>
      signUp.childId === selectedChildId &&
      signUp.courseId === course.courseId &&
      signUp.status === 'CONFIRMED')
  );

  if (loading) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        maxWidth: '500px',
        mx: 'auto',
      }}
    >
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      <TextField
        label="Имя родителя"
        value={formData.parentName}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Фамилия родителя"
        value={formData.parentSurname}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Контактный телефон"
        value={formData.parentPhone}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="E-mail"
        value={formData.parentEmail}
        fullWidth
        sx={{ mb: 3 }}
      />
      {children.length > 0 ? (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Выберите ребенка</InputLabel>
          <Select
            value={selectedChildId}
            onChange={handleChildSelect}
            label="Выберите ребенка"
            sx={{ textAlign: 'center' }}
          >
            {children.map((child) => (
              <MenuItem key={child.childId} value={child.childId}>
                {child.firstName} {child.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          У вас нет детей для записи. Добавьте их в личном кабинете.
        </Typography>
      )}

      <TextField
        label="Имя ребенка"
        value={formData.childName}
        InputLabelProps={{
          shrink: !!formData.childName,
        }}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Фамилия ребенка"
        value={formData.childSurname}
        InputLabelProps={{
          shrink: !!formData.childSurname,
        }}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Дата рождения ребенка"
        value={formData.childDOB}
        InputLabelProps={{
          shrink: !!formData.childDOB,
        }}
        fullWidth
        sx={{ mb: 3 }}
      />

      {formData.childAge && (
        <Typography sx={{ mb: 3 }}>
          <strong>Возраст ребенка:</strong> {formData.childAge} лет
        </Typography>
      )}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Выберите курс</InputLabel>
        <Select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          label="Выберите курс"
          sx={{ textAlign: 'center' }}
        >
          {filteredCourses.map((course) => {
            const courseStartDate = new Date(course.startDate);
            const isCourseStarted = courseStartDate < new Date();

            return (
              <MenuItem
                key={course.courseId}
                value={course.courseId}
                sx={{
                  backgroundColor: isCourseStarted ? '#f0f0f0' : 'inherit',
                  color: isCourseStarted ? '#999' : 'inherit'
                }}
              >
                {course.courseName} {isCourseStarted && '(Уже начался)'}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleSignUp}
        disabled={!selectedChildId || !selectedCourseId}
        sx={{ width: '100%' }}
      >
        Записаться
      </Button>
    </Box>
  );
};

export default SignUpToCourse;
