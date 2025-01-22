import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CoursesService from '../services/CoursesService';

const AddCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [courseImage, setCourseImage] = useState(null);
  const [courseAdvantages, setCourseAdvantages] = useState([{ advantageName: '', advantageDescription: '' }]);
  const [ageCategories, setAgeCategories] = useState([{ startAge: '', endAge: '', description: '' }]);
  const [pricing, setPricing] = useState([{ abonnementType: '', pricePerClass: '', classesPerMonth: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableSpots, setAvailableSpots] = useState(0);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setCourseImage(e.target.files[0]);
  };

  const handleAddAdvantage = () => {
    setCourseAdvantages([...courseAdvantages, { advantageName: '', advantageDescription: '' }]);
  };

  const handleRemoveAdvantage = (index) => {
    const newAdvantages = [...courseAdvantages];
    newAdvantages.splice(index, 1);
    setCourseAdvantages(newAdvantages);
  };

  const handleAddAgeCategory = () => {
    setAgeCategories([...ageCategories, { startAge: '', endAge: '', description: '' }]);
  };

  const handleRemoveAgeCategory = (index) => {
    const newCategories = [...ageCategories];
    newCategories.splice(index, 1);
    setAgeCategories(newCategories);
  };

  const handleAddPricing = () => {
    setPricing([...pricing, { abonnementType: '', pricePerClass: '', classesPerMonth: '' }]);
  };

  const handleRemovePricing = (index) => {
    const newPricing = [...pricing];
    newPricing.splice(index, 1);
    setPricing(newPricing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('courseName', courseName);
    formData.append('courseDescription', courseDescription);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('availableSpots', availableSpots);

    if (courseImage) {
      formData.append('courseImage', courseImage);
    }

    formData.append('courseAdvantages', JSON.stringify(courseAdvantages));
    formData.append('ageCategories', JSON.stringify(ageCategories));
    formData.append('pricing', JSON.stringify(pricing));

    try {
      setLoading(true);
      const response = await CoursesService.createCourses(formData);
      alert('Курс успешно добавлен');
      navigate('/manage-course-info');
    } catch (error) {
      console.error('Ошибка при загрузке курса:', error);
      setError('Произошла ошибка при добавлении курса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ p: 3, margin: 'auto' }}>
      <Typography variant="h4" component="h1" textAlign="center" sx={{ mb: 2 }}>
        Добавление нового курса
      </Typography>

      {error && (
        <Typography color="error" variant="body1" gutterBottom>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Название курса"
          fullWidth
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Описание курса"
          fullWidth
          multiline
          rows={4}
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Дата начала"
          type="date"
          fullWidth
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          sx={{ mb: 2}}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Дата окончания"
          type="date"
          fullWidth
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Количество мест"
          type="number"
          fullWidth
          value={availableSpots}
          onChange={(e) => setAvailableSpots(e.target.value)}
          required
          sx={{ mb: 2 }}
          inputProps={{ min: 0 }}
        />

        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          required
          style={{ marginBottom: '16px'}}
        />
        {loading && <p>Загрузка изображения...</p>}

        <Typography variant="h6" gutterBottom textAlign={'center'}>
          Преимущества курса
        </Typography>
        {courseAdvantages.map((advantage, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <TextField
              label="Название преимущества"
              fullWidth
              value={advantage.advantageName}
              onChange={(e) => {
                const updatedAdvantages = [...courseAdvantages];
                updatedAdvantages[index].advantageName = e.target.value;
                setCourseAdvantages(updatedAdvantages);
              }}
              required
              sx={{ mb: 1 }}
            />
            <TextField
              label="Описание преимущества"
              fullWidth
              value={advantage.advantageDescription}
              onChange={(e) => {
                const updatedAdvantages = [...courseAdvantages];
                updatedAdvantages[index].advantageDescription = e.target.value;
                setCourseAdvantages(updatedAdvantages);
              }}
              required
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveAdvantage(index)}
              sx={{ mb: 2, display: 'block' }}
            >
              Удалить
            </Button>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddAdvantage} sx={{ mb: 4 }}>
          Добавить преимущество
        </Button>

        <Typography variant="h6" gutterBottom textAlign={'center'}>
          Возрастные категории
        </Typography>
        {ageCategories.map((category, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <TextField
                label="Возраст от"
                type="number"
                value={category.startAge}
                onChange={(e) => {
                  const value = Math.max(0, e.target.value);
                  const updatedCategories = [...ageCategories];
                  updatedCategories[index].startAge = e.target.value;
                  if (value > updatedCategories[index].endAge) {
                    updatedCategories[index].endAge = value;
                  }
                  setAgeCategories(updatedCategories);
                }}
                inputProps={{ min: 0, max: 16 }}
                required
                fullWidth
                sx={{ mb: 1, mr: 1 }}
              />
              <TextField
                label="Возраст до"
                type="number"
                value={category.endAge}
                inputProps={{ min: 0, max: 16 }}
                onChange={(e) => {
                  const value = Math.max(0, e.target.value);
                  const updatedCategories = [...ageCategories];
                  updatedCategories[index].endAge = e.target.value;
                  setAgeCategories(updatedCategories);
                }}
                required
                fullWidth
                sx={{ mb: 1 }}
              />
            </Box>
            <TextField
              label="Описание категории"
              fullWidth
              value={category.description}
              onChange={(e) => {
                const updatedCategories = [...ageCategories];
                updatedCategories[index].description = e.target.value;
                setAgeCategories(updatedCategories);
              }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveAgeCategory(index)}
              sx={{ mb: 2, display: 'block' }}
            >
              Удалить
            </Button>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddAgeCategory} sx={{ mb: 4 }}>
          Добавить возрастную категорию
        </Button>

        <Typography variant="h6" gutterBottom textAlign={'center'}>
          Стоимость курса
        </Typography>
        {pricing.map((price, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <FormControl fullWidth sx={{ mb: 1, '& .MuiInputLabel-root': { backgroundColor: 'white', padding: '0 4px' } }}>
              <InputLabel>Тип абонемента</InputLabel>
              <Select
                value={price.abonnementType}
                onChange={(e) => {
                  const updatedPricing = [...pricing];
                  updatedPricing[index].abonnementType = e.target.value;
                  if (e.target.value === "2 раза в неделю") {
                    updatedPricing[index].classesPerMonth = 8;
                  } else if (e.target.value === "1 раз в неделю") {
                    updatedPricing[index].classesPerMonth = 4;
                  } else if (e.target.value === "Пробное") {
                    updatedPricing[index].classesPerMonth = 1;
                    updatedPricing[index].pricePerClass = 0;
                  } else if (e.target.value === "Разовое") {
                    updatedPricing[index].classesPerMonth = 1;
                  }
                  setPricing(updatedPricing);
                }}
              >
                <MenuItem value="2 раза в неделю">2 раза в неделю</MenuItem>
                <MenuItem value="1 раз в неделю">1 раз в неделю</MenuItem>
                <MenuItem value="Пробное">Пробное</MenuItem>
                <MenuItem value="Разовое">Разовое</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              label="Цена за занятие"
              type="number"
              value={price.pricePerClass}
              onChange={(e) => {
                const updatedPricing = [...pricing];
                updatedPricing[index].pricePerClass = e.target.value;
                setPricing(updatedPricing);
              }}
              required
              inputProps={{ min: 0 }}
              fullWidth
              sx={{ mb: 1, mr: 1 }}
            />
            <TextField
              label="Количество занятий в месяц"
              type="number"
              value={price.classesPerMonth}
              onChange={(e) => {
                const updatedPricing = [...pricing];
                updatedPricing[index].classesPerMonth = e.target.value;
                setPricing(updatedPricing);
              }}
              inputProps={{ min: 0 }}
              required
              fullWidth
              sx={{ mb: 2}}
            />
            </Box>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemovePricing(index)}
              sx={{ display: 'block' }}
            >
              Удалить
            </Button>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddPricing} sx={{ mb: 4 }}>
          Добавить цену
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Добавить курс'}
        </Button>
      </form>
    </Container>
  );
};

export default AddCourse;
