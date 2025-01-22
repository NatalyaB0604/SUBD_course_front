import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircle from '../pictures/account.png';
import logotype from '../pictures/logo_text.png';
import menuIcon from '../pictures/menu.png';
import CoursesService from '../services/CoursesService';

const menuItemsAuthParent = [
  { title: 'Главная', link: '/' },
  { title: 'О нас',
    children: [
      { title: 'О детском центре ВундерКидс', link: '/about' },
      { title: 'Скидки и акции', link: '/discounts' },
      { title: 'Отзывы', link: '/reviews' },
    ],
  },
  { title: 'Курсы и кружки', children: [], },
  { title: 'Стоимость занятий', link: '/course-pricing' },
];

const menuItemsAccount = [
  { title: 'Мой профиль', link: '/parent-account' },
  { title: 'Уведомления', link: '/notifications' },
  { title: 'Записи на курсы и кружки', link: '/parent-sign-ups' },
  { title: 'Мои отзывы', link: '/parent-reviews' },
  { title: 'Выход', link: '#' },
];

export default function AppBarAuthParent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CoursesService.getCourses();
        setCourses(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleAccountDrawer = () => {
    setIsAccountDrawerOpen(!isAccountDrawerOpen);
  };

  const handleMenuAccountItemClick = (item) => {
    if (item.link === '#') {
      if (item.title === 'Выход') {
        logout();
        navigate('/');
      }
    } else {
      navigate(item.link);
    }
    setIsAccountDrawerOpen(false);
  };

  const handleMenuItemClick = (link) => {
    toggleDrawer();
    window.location.href = link;
  };

  const dynamicMenuItems = [...menuItemsAuthParent];
  if (courses.length > 0) {
    dynamicMenuItems[2].children = courses.map((course) => ({
      title: course.courseName,
      link: `/courses/${course.courseId}`,
    }));
  }

  dynamicMenuItems.push({ title: 'Запись ребенка на курс', link: '/sign-up-to-course' });

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#cad7ff' }}>
        <Toolbar>
          <IconButton edge="start" color="black" aria-label="menu" onClick={toggleDrawer}>
            <img src={menuIcon} alt="Меню" style={{ width: '30px', height: '30px' }} />
          </IconButton>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            href="/"
            style={{ marginRight: 'auto', marginLeft: 'auto' }}
          >
            <img src={logotype} alt="Логотип" style={{ height: '100px' }} />
          </IconButton>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={toggleAccountDrawer}
            color="inherit"
            sx={{ position: 'absolute', right: '20px' }}
          >
            <img src={AccountCircle} alt="Аккаунт" style={{ width: '48px', height: '48px' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px' }}>
          <Typography variant="h5" sx={{ marginTop: '8px', marginLeft: '100px' }}>
            Меню
          </Typography>
          <IconButton onClick={toggleDrawer} aria-label="close" sx={{ color: 'black' }}>
            <CloseIcon />
          </IconButton>
        </div>

        <List sx={{ width: 300, padding: 2 }}>
          <ListItem
            key="main"
            sx={{ pl: 2 }}
            onClick={() => handleMenuItemClick(dynamicMenuItems[0].link)}>
            <ListItemText>
              <span style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                <Typography sx={{ marginLeft: 0 }}>{dynamicMenuItems[0].title}</Typography>
              </span>
            </ListItemText>
          </ListItem>

          <Divider/>

          {dynamicMenuItems.slice(1, 2).map((item, index) => {
            if (item.children) {
              return (
                <Accordion key={index} sx={{ boxShadow: 'none', backgroundColor: 'inherit' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{item.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List disablePadding>
                      {item.children.map((child, childIndex) => (
                        <ListItem key={childIndex} sx={{ pl: 4 }} onClick={() => handleMenuItemClick(child.link)}>
                          <ListItemText>
                            <span style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                              <Typography sx={{ marginLeft: 0 }}>{child.title}</Typography>
                            </span>
                          </ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              );
            }
            return null;
          })}

          <Accordion sx={{ boxShadow: 'none', backgroundColor: 'inherit' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{dynamicMenuItems[2].title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List disablePadding>
                {dynamicMenuItems[2].children.map((child, childIndex) => (
                  <ListItem key={childIndex} sx={{ pl: 4 }} onClick={() => handleMenuItemClick(child.link)}>
                    <ListItemText>
                      <span style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                        <Typography sx={{ marginLeft: 0 }}>{child.title}</Typography>
                      </span>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Divider/>

          <ListItem
            key="pricing"
            sx={{ pl: 2 }}
            onClick={() => handleMenuItemClick(dynamicMenuItems[3].link)}
          >
            <ListItemText>
              <span style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                <Typography sx={{ marginLeft: 0 }}>{dynamicMenuItems[3].title}</Typography>
              </span>
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>

      <Drawer anchor="right" open={isAccountDrawerOpen} onClose={toggleAccountDrawer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px' }}>
          <Typography variant="h5" sx={{ marginTop: '8px', marginLeft: '100px' }}>Аккаунт</Typography>
          <IconButton onClick={toggleAccountDrawer} aria-label="close" sx={{ color: 'black' }}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <List sx={{ width: 300, padding: 2 }}>
          {menuItemsAccount.map((item, index) => (
            <ListItem
              key={index}
              onClick={() => handleMenuAccountItemClick(item)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText>
                <Typography>{item.title}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
