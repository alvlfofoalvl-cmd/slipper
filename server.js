// server.js

// 1. Подключаем необходимые модули
const express = require('express');      // Веб-сервер (чтобы отдавать HTML и статику)
const http = require('http');            // Нужен, чтобы «привязать» Socket.IO к серверу
const socketIO = require('socket.io');   // Библиотека для WebSocket (реального времени)
const path = require('path');            // Для работы с путями к файлам

// 2. Создаём приложение Express
const app = express();

// 3. Создаём HTTP-сервер на базе нашего Express-приложения
const server = http.createServer(app);

// 4. Инициализируем Socket.IO, передавая ему наш HTTP-сервер
const io = socketIO(server);

// 5. Настраиваем раздачу статических файлов из папки public
// Теперь index.html, style.css, script.js будут доступны по адресу /
app.use(express.static(path.join(__dirname, 'public')));

// 6. Обработчик события подключения нового клиента
io.on('connection', (socket) => {
  console.log('Новый пользователь подключился:', socket.id);

  // 7. Обработчик входящего сообщения от клиента
  // Клиент отправляет событие 'message' с текстом сообщения
  socket.on('message', (data) => {
    // data — это объект, который мы передадим: { text: 'Привет', user: 'Вася' }
    console.log('Получено сообщение:', data);

    // 8. Рассылаем сообщение всем подключённым клиентам (включая отправителя)
    // io.emit отправляет событие всем, socket.emit — только этому клиенту
    io.emit('message', data);
  });

  // 9. Обработчик отключения клиента
  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
    // Здесь можно добавить логику: отправить сообщение «Вася вышел» и т.д.
  });
});

// 10. Запускаем сервер на порту 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Откройте в браузере: http://localhost:${PORT}`);
});
