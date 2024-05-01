import jwt from 'jsonwebtoken';
import { createUser } from '../mock/user.mock';
const User = require('../../db/models/user.js');

//esta função cria um usuário e retorna ele juntamente ao token
export const generateAuthentication = async (user = createUser) => {
   const newUser = await User.create(user);

   const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string, {
      subject: newUser.id.toString()
   });

   return { user: newUser, token };
};

export const generateInvalidToken = () => {
   const token = jwt.sign({}, 'INVALID_SECRET');

   return token;
};
