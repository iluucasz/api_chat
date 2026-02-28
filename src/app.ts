import 'express-async-errors';
import express, { json } from 'express';
import { userRoute } from './routers/user.route';
import { HandleErrors } from './errors/handleError.error';
import { createServer } from 'http';
import helmet from 'helmet';
import path from 'path';
import { Server as SocketIO } from 'socket.io';
require('./db');

export const app = express();
export const server = createServer(app);

//configurações para que o Helmet possa funcionar utilizando o socket.io que está renderizando no index.html
app.use(
   helmet({
      contentSecurityPolicy: {
         directives: {
            defaultSrc: [ "'self'" ],
            connectSrc: [ "'self'", 'ws:', 'wss:' ],
            scriptSrc: [ "'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://code.jquery.com' ],
            styleSrc: [ "'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net' ],
            fontSrc: [ "'self'", 'https://cdn.jsdelivr.net' ],
            imgSrc: [ "'self'", 'data:' ]
         }
      }
   })
);
app.use(json());
app.use('/users', userRoute);
app.use(HandleErrors.execute);
app.use(express.static(path.join(__dirname, '..', 'public')));

//configurações do socket.io
const io = new SocketIO(server, {
   cors: {
      origin: '*',
      methods: [ 'GET', 'POST' ]
   }
});

// Track online users: socketId -> { id, firstName, lastName, email, avatar }
const onlineUsers = new Map<string, { id: string; firstName: string; lastName: string; email: string }>();

function broadcastOnlineUsers() {
   const users = Array.from(onlineUsers.entries()).map(([ socketId, user ]) => ({
      socketId,
      ...user
   }));
   io.emit('online users', users);
}

io.on('connection', socket => {
   console.log('A user connected:', socket.id);

   // Client sends its user info right after connecting
   socket.on('register user', (user: { id: string; firstName: string; lastName: string; email: string }) => {
      onlineUsers.set(socket.id, user);
      broadcastOnlineUsers();
   });

   socket.on('chat message', msg => {
      console.log(`message: ${msg}`);
      io.emit('chat message', msg);
   });

   socket.on('typing', (data) => {
      socket.broadcast.emit('user typing', data);
   });

   socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
      onlineUsers.delete(socket.id);
      broadcastOnlineUsers();
   });
});
