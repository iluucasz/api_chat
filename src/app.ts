import 'express-async-errors';
import express, { json, Request, Response } from 'express';
import helmet from 'helmet';
import { userRoute } from './routers/user.route';
import { HandleErrors } from './errors/handleError.error';
import { Server as SocketIO } from 'socket.io';
import { createServer } from 'http';
require('./db');

export const app = express();
app.use(helmet());
app.use(json());

export const server = createServer(app);
const io = new SocketIO(server, {
   cors: {
      origin: '*', // Ajuste conforme necessário para sua configuração de CORS
      methods: [ 'GET', 'POST' ]
   }
});

app.use('/users', userRoute);
// app.get('/', (req: Request, res: Response) => {
//    res.send('Api live chat');
// });
app.use(HandleErrors.execute);

// Configuração do Socket.IO
io.on('connection', socket => {
   console.log('A user connected:', socket.id);

   // Exemplo de manipulação de evento
   socket.on('chat message', msg => {
      console.log(`message: ${msg}`);
      io.emit('chat message', msg); // Emitir para todos os usuários conectados
   });

   socket.on('disconnect', () => {
      console.log('user disconnected');
   });
});
