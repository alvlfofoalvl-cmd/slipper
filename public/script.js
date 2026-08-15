// public/script.js

// 1. Создаём соединение с сервером
// Если вы запускаете локально, адрес будет http://localhost:3000
// При деплое в интернет сюда нужно будет подставить реальный домен
const socket = io();

// 2. Получаем элементы DOM
const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

// 3. Функция для добавления сообщения на страницу
function addMessage(text, user = 'Система') {
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = `${user}: ${text}`;
  messagesDiv.appendChild(div);

  // Автопрокрутка вниз к последнему сообщению
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 4. Обработчик отправки формы (нажатие Enter или кнопки)
chatForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Не перезагружать страницу

  const text = messageInput.value.trim();
  if (!text) return; // Если пусто — ничего не делаем

  // Отправляем событие 'message' на сервер
  // Передаём объект: текст и имя пользователя (можно сделать поле для имени)
  socket.emit('message', {
    text: text,
    user: 'Вы' // В реальном проекте можно брать имя из input
  });

  messageInput.value = ''; // Очищаем поле ввода
});

// 5. Слушаем событие 'message', которое присылает сервер
// Сервер делает io.emit('message', data), и все клиенты получают это событие
socket.on('message', (data) => {
  // data — это тот же объект, что мы отправили: { text, user }
  addMessage(data.text, data.user);
});

// 6. Добавим приветственное сообщение при загрузке страницы
addMessage('Добро пожаловать в чат! Пишите сообщения.', 'Система');
