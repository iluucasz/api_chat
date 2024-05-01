import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.error';
import {
   TCreateUser,
   TCreateUserReturn,
   TLoginUser,
   TLoginUserReturn,
   TUpdateReturn,
   TUserReturn
} from '../interfaces/user.interface';
import {
   createUserSchemaReturn,
   loginUserSchemaReturn,
   updateSchemaReturn,
   userSchemaReturn
} from '../schemas/user.schema';
const User = require('../db/models/user.js');

//crud com sequelize
export class UserService {
   registerUser = async (body: TCreateUser): Promise<TCreateUserReturn> => {
      const hashPassword = await bcrypt.hash(body.password, 10);
      const hashed = { ...body, password: hashPassword };
      const user = await User.create(hashed);
      return createUserSchemaReturn.parse(user);
   };

   loginUser = async (body: TLoginUser): Promise<TLoginUserReturn> => {
      const { email, password } = body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
         throw new AppError(404, 'User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         throw new AppError(401, 'Invalid password');
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
      return { token, user: loginUserSchemaReturn.parse(user) };
   };

   getUser = async (): Promise<TUserReturn | null> => {
      const user = await User.findAll();
      return userSchemaReturn.parse(user);
   };

   updateUser = async (body: TCreateUser, id: number): Promise<TUpdateReturn> => {
      const user = await User.findByPk(id);
      if (!user) {
         throw new AppError(404, 'User not Found');
      }
      user.set(body);
      await user.save();
      return updateSchemaReturn.parse(user);
   };

   deleteUser = async (id: number) => {
      const find = await User.findByPk(id);
      if (!find) {
         throw new AppError(404, 'User not Found');
      }
      return await User.destroy({ where: { id } });
   };
}
