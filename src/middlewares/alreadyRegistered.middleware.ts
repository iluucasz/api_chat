import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.error';
const User = require('../db/models/user.js');

//Acessa o banco de dados e verifica se o email já existe
export class AlreadyRegistered {
   static execute = async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findOne({ where: { email: req.body.email } });

      if (user) {
         throw new AppError(403, 'E-mail already registered');
      }

      next();
   };
}
