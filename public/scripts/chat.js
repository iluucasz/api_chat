const socket = io('http://localhost:3000');

const status = document.getElementById("status");
const messages = document.getElementById("messages");
const input = document.getElementById("message-input");
const typing = document.getElementById("typing");
const sendButton = document.getElementById("send-button");

let typingTimeout;

const appendMessage = (content, fromSelf = false, senderName) => {
  const item = document.createElement("li");
  const time = new Date().toLocaleTimeString();
  const sender = fromSelf ? "Você" : senderName;
  item.textContent = `${sender ? sender : 'Live-chat'}: ${content} (${time})`;
  if (fromSelf) {
    item.style.color = "blue"; // Estilo diferente para mensagens próprias
  }
  messages.appendChild(item);
};

// Função para obter os detalhes do usuário do localStorage
const getUserDetails = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Função para remover o token e os detalhes do usuário do localStorage
const removeUserDetails = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Verifica se há um usuário logado, se não houver, redireciona para a página de login
const currentUser = getUserDetails();
if (!currentUser) {
  window.location.href = '/';
}

// Exibe o nome do usuário no chat
status.innerText = `Conectado como: ${currentUser.firstName} ${currentUser.lastName}`;

socket.on("connect", () => {
  appendMessage(`event: connect | session id: ${socket.id}`);
});

socket.on("connect_error", (err) => {
  appendMessage(`event: connect_error | reason: ${err.message}`);
});

socket.on("disconnect", (reason) => {
  appendMessage(`event: disconnect | reason: ${reason}`);
  removeUserDetails(); // Remove os detalhes do usuário do localStorage ao desconectar
  window.location.href = '/'; // Redireciona para a página de login ao desconectar
});

socket.on("chat message", (msg) => {
  if (msg.senderId !== socket.id) {
    appendMessage(msg.text, false, msg.senderName); // Passa o nome do remetente para a função
  }
  typing.innerText = '';
});

socket.on("user typing", (data) => {
  const { username, isTyping } = data;
  if (isTyping) {
    typing.innerText = `${username} is typing...`;
  } else {
    typing.innerText = '';
  }
});

input.addEventListener('input', () => {
  socket.emit("typing", { isTyping: input.value.length > 0 });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("typing", { isTyping: false });
  }, 3000);
});

sendButton.onclick = () => {
  if (input.value) {
    const message = { text: input.value, senderId: socket.id, senderName: currentUser.firstName };
    socket.emit("chat message", message);
    appendMessage(input.value, true);  // A mensagem é adicionada localmente como uma mensagem própria
    input.value = "";
    typing.innerText = '';
  }
};
