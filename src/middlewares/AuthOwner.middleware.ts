import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.error';
const User = require('../db/models/user.js');

//esta classe verifica se o usuário pertence a ação que ele está fazendo
export class AuthOwner {
   static execute = async (request: Request, response: Response, next: NextFunction) => {
      const userId = response.locals.decode.id;
      const id = Number(request.params.id);

      const user = await User.findByPk(id);
      const verify = user.dataValues.id;

      if (verify !== userId) {
         throw new AppError(403, 'This user is not owner');
      }
      next();
   };
}
