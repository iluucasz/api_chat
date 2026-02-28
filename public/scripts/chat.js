/* ── Helpers ── */
const AVATAR_COLORS = [
  '#6c63ff','#ff6b9d','#48dbfb','#ff9f43','#51cf66',
  '#e74c3c','#9b59b6','#1abc9c','#f39c12','#3498db'
];

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(firstName, lastName) {
  return ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase();
}

function createAvatarEl(firstName, lastName, extraClass = '') {
  const el = document.createElement('div');
  el.className = `avatar ${extraClass}`.trim();
  el.style.background = colorFor(firstName + lastName);
  el.textContent = initials(firstName, lastName);
  const dot = document.createElement('span');
  dot.className = 'online-dot';
  el.appendChild(dot);
  return el;
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ── Auth check ── */
const getUserDetails = () => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};

const currentUser = getUserDetails();
if (!currentUser) {
  window.location.href = '/';
}

/* ── DOM refs ── */
const messagesUl   = document.getElementById('messages');
const messagesArea = document.getElementById('messages-area');
const input        = document.getElementById('message-input');
const typingEl     = document.getElementById('typing');
const userListEl   = document.getElementById('user-list');
const onlineCount  = document.getElementById('online-count');
const myNameEl     = document.getElementById('my-name');
const myAvatarEl   = document.getElementById('my-avatar');
const sidebar      = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const btnLogout    = document.getElementById('btn-logout');
const messageForm  = document.getElementById('message-form');

/* Set current user info in sidebar footer */
myNameEl.textContent = currentUser.firstName;
myAvatarEl.style.background = colorFor(currentUser.firstName + currentUser.lastName);
myAvatarEl.textContent = initials(currentUser.firstName, currentUser.lastName);

/* ── Sidebar toggle (mobile) ── */
sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

/* ── Logout ── */
btnLogout.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
});

/* ── Socket ── */
const socket = io('http://localhost:3000');
let typingTimeout;

socket.on('connect', () => {
  // Register this user on the server
  socket.emit('register user', {
    id: currentUser.id,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email
  });
  appendSystem('Conectado ao chat');
});

socket.on('connect_error', (err) => {
  appendSystem(`Erro de conexão: ${err.message}`);
});

socket.on('disconnect', () => {
  appendSystem('Desconectado do chat');
});

/* ── Online users list ── */
socket.on('online users', (users) => {
  userListEl.innerHTML = '';
  onlineCount.textContent = `${users.length} online`;

  users.forEach(u => {
    const item = document.createElement('div');
    item.className = 'user-item' + (u.socketId === socket.id ? ' is-me' : '');

    const avatar = createAvatarEl(u.firstName, u.lastName);
    const info = document.createElement('div');
    info.innerHTML = `
      <div class="user-name">${u.firstName} ${u.lastName}</div>
      <div class="user-status">${u.socketId === socket.id ? 'Você' : 'Online'}</div>
    `;

    item.appendChild(avatar);
    item.appendChild(info);
    userListEl.appendChild(item);
  });
});

/* ── Messages ── */
function scrollToBottom() {
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

function appendSystem(text) {
  const li = document.createElement('li');
  li.className = 'msg system';
  li.textContent = text;
  messagesUl.appendChild(li);
  scrollToBottom();
}

function appendMessage(text, fromSelf = false, senderName = '') {
  const li = document.createElement('li');
  li.className = `msg ${fromSelf ? 'self' : 'other'}`;

  if (!fromSelf && senderName) {
    const sender = document.createElement('div');
    sender.className = 'msg-sender';
    sender.textContent = senderName;
    li.appendChild(sender);
  }

  const body = document.createElement('div');
  body.textContent = text;
  li.appendChild(body);

  const time = document.createElement('div');
  time.className = 'msg-time';
  time.textContent = timeNow();
  li.appendChild(time);

  messagesUl.appendChild(li);
  scrollToBottom();
}

socket.on('chat message', (msg) => {
  if (msg.senderId !== socket.id) {
    appendMessage(msg.text, false, msg.senderName);
  }
  typingEl.textContent = '';
});

/* ── Typing indicator ── */
socket.on('user typing', (data) => {
  if (data.isTyping) {
    typingEl.textContent = `${data.username || 'Alguém'} está digitando...`;
  } else {
    typingEl.textContent = '';
  }
});

input.addEventListener('input', () => {
  socket.emit('typing', { username: currentUser.firstName, isTyping: input.value.length > 0 });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing', { username: currentUser.firstName, isTyping: false });
  }, 3000);
});

/* ── Send message ── */
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!input.value.trim()) return;

  const message = {
    text: input.value.trim(),
    senderId: socket.id,
    senderName: currentUser.firstName
  };
  socket.emit('chat message', message);
  appendMessage(message.text, true);
  input.value = '';
  typingEl.textContent = '';
});

/* Close sidebar when clicking outside on mobile */
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 700 && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && e.target !== sidebarToggle && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  }
});
