import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthToken } from '../middlewares/AuthToken.middleware';
import { AuthOwner } from '../middlewares/AuthOwner.middleware';
import { ValidateBody } from '../middlewares/validateBody.middleware';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';
import { AlreadyRegistered } from '../middlewares/alreadyRegistered.middleware';

export const userRoute = Router();
const userController = new UserController();

userRoute.get('/', AuthToken.execute, userController.getUser);
userRoute.post(
   '/register',
   AlreadyRegistered.execute,
   ValidateBody.execute(createUserSchema),
   userController.registerUser
);
userRoute.post('/login', ValidateBody.execute(loginUserSchema), userController.loginUser);
userRoute.patch(
   '/:id',
   ValidateBody.execute(createUserSchema),
   AuthToken.execute,
   AuthOwner.execute,
   userController.updateUser
);
userRoute.delete('/:id', AuthToken.execute, userController.deleteUser);
