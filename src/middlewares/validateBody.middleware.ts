import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

//classe que faz validação de schema com zod
export class ValidateBody {
   static execute = (schema: AnyZodObject) => (request: Request, _: Response, next: NextFunction) => {
      request.body = schema.parse(request.body);
      return next();
   };
}
