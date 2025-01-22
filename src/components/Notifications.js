import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Checkbox, Modal } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { userInfo } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      const parentId = userInfo?.data?.parentId || userInfo?.parentId;
      if (parentId) {
        try {
          const response = await axios.get(`http://localhost:8080/vunder-kids/notifications/get/${parentId}`);
          setNotifications(response.data);
        } catch (error) {
          console.error('Ошибка загрузки уведомлений:', error);
        }
      }
    };

    loadNotifications();
  }, [userInfo]);

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(Array.from(selectedNotifications).map(async (notificationId) => {
        await axios.delete(`http://localhost:8080/vunder-kids/notifications/delete/${notificationId}`);
      }));

      setNotifications(notifications.filter(notification => !selectedNotifications.has(notification.notificationId)));
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error('Ошибка при удалении уведомлений:', error);
    }
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" textAlign="center">Уведомления</Typography>
      <Button
        variant="outlined"
        onClick={() => setEditMode(!editMode)}
        sx={{ mb: 2 }}
      >
        {editMode ? 'Скрыть выбор' : 'Редактировать'}
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleDeleteSelected}
        disabled={selectedNotifications.size === 0}
        sx={{ mb: 2, ml: 2 }}
      >
        Удалить выбранные
      </Button>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Box key={notification.notificationId} sx={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '4px', marginTop: '4px' }}>
            {editMode && (
              <Checkbox
                checked={selectedNotifications.has(notification.notificationId)}
                onChange={() => {
                  const newSelected = new Set(selectedNotifications);
                  if (newSelected.has(notification.notificationId)) {
                    newSelected.delete(notification.notificationId);
                  } else {
                    newSelected.add(notification.notificationId);
                  }
                  setSelectedNotifications(newSelected);
                }}
              />
            )}
            <Typography>{notification.message}</Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(notification.sentAt).toLocaleString('ru-RU')}
            </Typography>
            <Button onClick={() => handleViewDetails(notification)} size="small">Просмотреть</Button>
          </Box>
        ))
      ) : (
        <Typography>Нет новых уведомлений.</Typography>
      )}

      <Modal open={detailsModalOpen} onClose={handleCloseDetailsModal}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" gutterBottom>Детали уведомления</Typography>
          {selectedNotification && (
            <>
              <Typography><strong>Сообщение:</strong> {selectedNotification.message}</Typography>
              <Typography><strong>Время отправки:</strong> {new Date(selectedNotification.sentAt).toLocaleString('ru-RU')}</Typography>
            </>
          )}
          <Button onClick={handleCloseDetailsModal}>Закрыть</Button>
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

export default Notifications;
