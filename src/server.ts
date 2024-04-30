import { app, server } from './app';

const port = process.env.PORT || 3000;
server.listen(port, () => {
   console.log(`Api has been started on port: http://localhost:${port}/ 🚀`);
});
