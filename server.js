// server.js или соответствующий файл маршрутов
const nodemailer = require('nodemailer');

// Создаем транспорт для Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // или другой почтовый сервис
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

app.post('/send-notification', async (req, res) => {
  const { email, message } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Уведомление об отмене записи',
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Ошибка отправки почты:', error);
    res.status(500).send({ success: false, message: 'Ошибка отправки почты.' });
  }
});

app.get('/notifications', async (req, res) => {
  try {
    // Получите уведомления из базы данных
    const notifications = await getNotificationsFromDatabase(); // Ваш метод для получения уведомлений
    res.json(notifications);
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error);
    res.status(500).send('Ошибка получения уведомлений');
  }
});
