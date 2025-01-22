/*import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, MenuItem } from '@mui/material';
import SignUpsService from '../services/SignUpsService';
import axios from 'axios';

const ManageSignUps = () => {
  const [signUps, setSignUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedSignUpId, setSelectedSignUpId] = useState(null);
  const [refusalMessage, setRefusalMessage] = useState('');
  const [childDetailsModal, setChildDetailsModal] = useState(false);
  const [childDetails, setChildDetails] = useState(null);

  const [cancellationReasons] = useState([
    { value: 'AGE_NOT_SUITABLE', label: 'Не подходит по возрасту' },
    { value: 'FULL_CAPACITY', label: 'Количество детей уже набралось' },
  ]);

  const [selectedReason, setSelectedReason] = useState('');

  useEffect(() => {
    const fetchSignUps = async () => {
      try {
        const response = await SignUpsService.getAllSignUps();
        const pendingSignUps = response.data.filter((signUp) => signUp.status === 'PENDING');

        const signUpsWithDetails = await Promise.all(
          pendingSignUps.map(async (signUp) => {
            const childResponse = await SignUpsService.getChildById(signUp.childId);
            const courseResponse = await SignUpsService.getCourseById(signUp.courseId);
            return {
              ...signUp,
              firstName: childResponse.data.firstName,
              lastName: childResponse.data.lastName,
              courseName: courseResponse.data.courseName,
              status: translateStatus(signUp.status),
            };
          })
        );

        setSignUps(signUpsWithDetails);
      } catch (error) {
        setErrorMessage('Не удалось загрузить записи.');
        console.error('Ошибка при загрузке записей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignUps();
  }, []);

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

  const handleViewDetails = async (childId) => {
    try {
      const childResponse = await SignUpsService.getChildById(childId);
      const signUp = childResponse.data.signUps.find((signUp) => signUp.status === 'PENDING');
      if (!signUp || !signUp.parentId) {
        throw new Error('У ребенка отсутствует ID родителя.');
      }

      const parentResponse = await SignUpsService.getParentById(signUp.parentId);

      setChildDetails({
        firstName: childResponse.data.firstName,
        lastName: childResponse.data.lastName,
        birthDate: childResponse.data.birthDate,
        age: calculateAge(childResponse.data.birthDate),
        parent: {
          firstName: parentResponse.data.firstName,
          lastName: parentResponse.data.lastName,
          phone: parentResponse.data.phoneNumber,
          email: parentResponse.data.email,
        },
      });

      setChildDetailsModal(true);
    } catch (error) {
      console.error('Ошибка при загрузке данных ребенка и родителя:', error);
      alert('Не удалось загрузить данные ребенка: ' + error.message);
    }
  };

  const handleCloseChildDetails = () => {
    setChildDetailsModal(false);
    setChildDetails(null);
  };

  const handleConfirm = async (signUpId) => {
    try {
      await SignUpsService.confirmSignUp(signUpId);
      setSignUps(signUps.filter((signUp) => signUp.signUpId !== signUpId));
      alert('Запись подтверждена.');
    } catch (error) {
      console.error('Ошибка при подтверждении записи:', error);
      alert('Не удалось подтвердить запись: ' + error.message);
    }
  };

  const handleCancelOpen = (signUpId) => {
    setSelectedSignUpId(signUpId);
    setOpen(true);
  };

  const handleCancelClose = () => {
    setOpen(false);
    setRefusalMessage('');
    setSelectedReason('');
  };

  const handleCancel = async () => {
    if (!refusalMessage) {
        alert('Пожалуйста, введите сообщение об отказе.');
        return;
    }

    try {
        const signUp = signUps.find((s) => s.signUpId === selectedSignUpId);
        const parentId = signUp.parentId;
        const courseResponse = await SignUpsService.getCourseById(signUp.courseId);
        const courseName = courseResponse.data.courseName;

        const reason = cancellationReasons.find(reason => reason.value === selectedReason)?.label || refusalMessage;

        await axios.post(`http://localhost:8080/vunder-kids/notifications/send-notification/${parentId}`, {
            message: `Запись на курс "${courseName}" отклонена. Причина: ${reason}`,
        });

        await SignUpsService.cancelSignUp(selectedSignUpId, { message: refusalMessage });
        setSignUps(signUps.filter((signUp) => signUp.signUpId !== selectedSignUpId));
        alert('Запись отклонена. Сообщение отправлено родителю.');
        handleCancelClose();
    } catch (error) {
        console.error('Ошибка при отклонении записи:', error);
        alert('Не удалось отклонить запись: ' + error.message);
    }
  };

  if (loading) {
    return <Typography>Загрузка...</Typography>;
  }

  if (errorMessage) {
    return <Typography color="error">{errorMessage}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom textAlign={'center'}>Управление записями</Typography>
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
                <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd' }}>{signUp.status}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      onClick={() => handleViewDetails(signUp.childId)}
                      variant="outlined"
                      color="primary"
                      size="small"
                    >
                      Подробнее
                    </Button>
                    <Button
                      onClick={() => handleConfirm(signUp.signUpId)}
                      variant="contained"
                      color="info"
                      size="small"
                    >
                      Подтвердить
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleCancelOpen(signUp.signUpId)}
                      variant="outlined"
                      size="small"
                    >
                      Отклонить
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={childDetailsModal} onClose={handleCloseChildDetails}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" gutterBottom textAlign={'center'} fontWeight={'bold'}>Информация о ребенке</Typography>
          {childDetails && (
            <>
              <Typography><strong>Имя:</strong> {childDetails.firstName}</Typography>
              <Typography><strong>Фамилия:</strong> {childDetails.lastName}</Typography>
              <Typography>
                <strong>Дата рождения:</strong> {new Date(childDetails.birthDate).toLocaleDateString()}
              </Typography>
              <Typography><strong>Возраст:</strong> {childDetails.age} лет</Typography>
              <Typography sx={{ mt: 2, marginLeft: 2 }}><strong>Родитель</strong></Typography>
              <Typography><strong>Имя:</strong> {childDetails.parent.firstName}</Typography>
              <Typography><strong>Фамилия:</strong> {childDetails.parent.lastName}</Typography>
              <Typography><strong>Телефон:</strong> {childDetails.parent.phone}</Typography>
              <Typography><strong>Email:</strong> {childDetails.parent.email}</Typography>
            </>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" onClick={handleCloseChildDetails}>
              Закрыть
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={open} onClose={handleCancelClose}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" gutterBottom>Введите сообщение о причине отказа</Typography>
          <TextField
            select
            label="Причина отказа"
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              if (e.target.value !== 'OTHER') {
                setRefusalMessage(e.target.value);
              } else {
                setRefusalMessage('');
              }
            }}
            fullWidth
            required
          >
            {cancellationReasons.map((reason) => (
              <MenuItem key={reason.value} value={reason.value}>
                {reason.label}
              </MenuItem>
            ))}
            <MenuItem value="OTHER">Другое</MenuItem>
          </TextField>
          {selectedReason === 'OTHER' && (
            <TextField
              label="Введите ваше сообщение"
              multiline
              rows={4}
              value={refusalMessage}
              onChange={(e) => setRefusalMessage(e.target.value)}
              fullWidth
              required
            />
          )}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleCancelClose}>Отмена</Button>
            <Button variant="contained" color="primary" onClick={handleCancel}>Отклонить</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default ManageSignUps;*/

import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, MenuItem } from '@mui/material';
import SignUpsService from '../services/SignUpsService';
import CoursesService from '../services/CoursesService';
import axios from 'axios';

const ManageSignUps = () => {
  const [signUps, setSignUps] = useState([]);
  const [filteredSignUps, setFilteredSignUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedSignUpId, setSelectedSignUpId] = useState(null);
  const [refusalMessage, setRefusalMessage] = useState('');
  const [childDetailsModal, setChildDetailsModal] = useState(false);
  const [childDetails, setChildDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  const [cancellationReasons] = useState([
    { value: 'AGE_NOT_SUITABLE', label: 'Не подходит по возрасту' },
    { value: 'FULL_CAPACITY', label: 'Количество детей уже набралось' },
  ]);

  const [selectedReason, setSelectedReason] = useState('');

  useEffect(() => {
    const fetchSignUpsAndCourses = async () => {
      try {
        const [signUpsResponse, coursesResponse] = await Promise.all([
          SignUpsService.getAllSignUps(),
          CoursesService.getCourses(),
        ]);

        const pendingSignUps = signUpsResponse.data.filter((signUp) => signUp.status === 'PENDING');

        const signUpsWithDetails = await Promise.all(
          pendingSignUps.map(async (signUp) => {
            const childResponse = await SignUpsService.getChildById(signUp.childId);
            const courseResponse = await SignUpsService.getCourseById(signUp.courseId);
            return {
              ...signUp,
              firstName: childResponse.data.firstName,
              lastName: childResponse.data.lastName,
              courseName: courseResponse.data.courseName,
              status: translateStatus(signUp.status),
            };
          })
        );

        setSignUps(signUpsWithDetails);
        setFilteredSignUps(signUpsWithDetails);
        setCourses(coursesResponse.data);
      } catch (error) {
        setErrorMessage('Не удалось загрузить записи.');
        console.error('Ошибка при загрузке записей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignUpsAndCourses();
  }, []);

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

  const handleViewDetails = async (childId) => {
    try {
      const childResponse = await SignUpsService.getChildById(childId);
      const signUp = childResponse.data.signUps.find((signUp) => signUp.status === 'PENDING');
      if (!signUp || !signUp.parentId) {
        throw new Error('У ребенка отсутствует ID родителя.');
      }

      const parentResponse = await SignUpsService.getParentById(signUp.parentId);

      setChildDetails({
        firstName: childResponse.data.firstName,
        lastName: childResponse.data.lastName,
        birthDate: childResponse.data.birthDate,
        age: calculateAge(childResponse.data.birthDate),
        parent: {
          firstName: parentResponse.data.firstName,
          lastName: parentResponse.data.lastName,
          phone: parentResponse.data.phoneNumber,
          email: parentResponse.data.email,
        },
      });

      setChildDetailsModal(true);
    } catch (error) {
      console.error('Ошибка при загрузке данных ребенка и родителя:', error);
      alert('Не удалось загрузить данные ребенка: ' + error.message);
    }
  };

  const handleCloseChildDetails = () => {
    setChildDetailsModal(false);
    setChildDetails(null);
  };

  const handleCourseFilterChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);

    if (courseId) {
      const filtered = signUps.filter(signUp => signUp.courseId === courseId);
      setFilteredSignUps(filtered);
    } else {
      setFilteredSignUps(signUps);
    }
  };

  const handleConfirm = async (signUpId) => {
    try {
      await SignUpsService.confirmSignUp(signUpId);
      setSignUps(signUps.filter((signUp) => signUp.signUpId !== signUpId));
      alert('Запись подтверждена.');
    } catch (error) {
      console.error('Ошибка при подтверждении записи:', error);
      alert('Не удалось подтвердить запись: ' + error.message);
    }
  };

  const handleCancelOpen = (signUpId) => {
    setSelectedSignUpId(signUpId);
    setOpen(true);
  };

  const handleCancelClose = () => {
    setOpen(false);
    setRefusalMessage('');
    setSelectedReason('');
  };

  const handleCancel = async () => {
    if (!refusalMessage) {
        alert('Пожалуйста, введите сообщение об отказе.');
        return;
    }

    try {
        const signUp = signUps.find((s) => s.signUpId === selectedSignUpId);
        const parentId = signUp.parentId;
        const courseResponse = await SignUpsService.getCourseById(signUp.courseId);
        const courseName = courseResponse.data.courseName;

        const reason = cancellationReasons.find(reason => reason.value === selectedReason)?.label || refusalMessage;

        await axios.post(`http://localhost:8080/vunder-kids/notifications/send-notification/${parentId}`, {
            message: `Запись на курс "${courseName}" отклонена. Причина: ${reason}`,
        });

        await SignUpsService.cancelSignUp(selectedSignUpId, { message: refusalMessage });
        setSignUps(signUps.filter((signUp) => signUp.signUpId !== selectedSignUpId));
        alert('Запись отклонена. Сообщение отправлено родителю.');
        handleCancelClose();
    } catch (error) {
        console.error('Ошибка при отклонении записи:', error);
        alert('Не удалось отклонить запись: ' + error.message);
    }
  };

  if (loading) {
    return <Typography>Загрузка...</Typography>;
  }

  if (errorMessage) {
    return <Typography color="error">{errorMessage}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom textAlign={'center'}>Управление записями</Typography>

      {/* Фильтр по курсам */}
      <TextField
        select
        label="Выберите курс"
        value={selectedCourse}
        onChange={handleCourseFilterChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="">
          <em>Все курсы</em>
        </MenuItem>
        {courses.map(course => (
          <MenuItem key={course.courseId} value={course.courseId}>
            {course.courseName}
          </MenuItem>
        ))}
      </TextField>

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
            {filteredSignUps.map((signUp) => (
              <TableRow key={signUp.signUpId}>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd' }}>{signUp.firstName}</TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd' }}>{signUp.lastName}</TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd' }}>{signUp.courseName}</TableCell>
                <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd' }}>{signUp.status}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      onClick={() => handleViewDetails(signUp.childId)}
                      variant="outlined"
                      color="primary"
                      size="small"
                    >
                      Подробнее
                    </Button>
                    <Button
                      onClick={() => handleConfirm(signUp.signUpId)}
                      variant="contained"
                      color="info"
                      size="small"
                    >
                      Подтвердить
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleCancelOpen(signUp.signUpId)}
                      variant="outlined"
                      size="small"
                    >
                      Отклонить
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={childDetailsModal} onClose={handleCloseChildDetails}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" gutterBottom textAlign={'center'} fontWeight={'bold'}>Информация о ребенке</Typography>
          {childDetails && (
            <>
              <Typography><strong>Имя:</strong> {childDetails.firstName}</Typography>
              <Typography><strong>Фамилия:</strong> {childDetails.lastName}</Typography>
              <Typography>
                <strong>Дата рождения:</strong> {new Date(childDetails.birthDate).toLocaleDateString()}
              </Typography>
              <Typography><strong>Возраст:</strong> {childDetails.age} лет</Typography>
              <Typography sx={{ mt: 2, marginLeft: 2 }}><strong>Родитель</strong></Typography>
              <Typography><strong>Имя:</strong> {childDetails.parent.firstName}</Typography>
              <Typography><strong>Фамилия:</strong> {childDetails.parent.lastName}</Typography>
              <Typography><strong>Телефон:</strong> {childDetails.parent.phone}</Typography>
              <Typography><strong>Email:</strong> {childDetails.parent.email}</Typography>
            </>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" onClick={handleCloseChildDetails}>
              Закрыть
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={open} onClose={handleCancelClose}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" gutterBottom>Введите сообщение о причине отказа</Typography>
          <TextField
            select
            label="Причина отказа"
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              if (e.target.value !== 'OTHER') {
                setRefusalMessage(e.target.value);
              } else {
                setRefusalMessage('');
              }
            }}
            fullWidth
            required
          >
            {cancellationReasons.map((reason) => (
              <MenuItem key={reason.value} value={reason.value}>
                {reason.label}
              </MenuItem>
            ))}
            <MenuItem value="OTHER">Другое</MenuItem>
          </TextField>
          {selectedReason === 'OTHER' && (
            <TextField
              label="Введите ваше сообщение"
              multiline
              rows={4}
              value={refusalMessage}
              onChange={(e) => setRefusalMessage(e.target.value)}
              fullWidth
              required
            />
          )}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleCancelClose}>Отмена</Button>
            <Button variant="contained" color="primary" onClick={handleCancel}>Отклонить</Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default ManageSignUps;
