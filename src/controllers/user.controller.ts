import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
   private userService = new UserService();
   registerUser = async (req: Request, res: Response): Promise<Response> => {
      const user = await this.userService.registerUser(req.body);
      return res.status(201).json(user);
   };

   loginUser = async (req: Request, res: Response): Promise<Response> => {
      const body = req.body;
      const login = await this.userService.loginUser(body);
      return res.status(200).json(login);
   };

   getUser = async (req: Request, res: Response): Promise<Response> => {
      const user = await this.userService.getUser();
      return res.status(200).json(user);
   };

   updateUser = async (req: Request, res: Response): Promise<Response> => {
      const body = req.body;
      const id = res.locals.decode?.id;
      const user = await this.userService.updateUser(body, id);
      return res.status(200).json(user);
   };

   deleteUser = async (req: Request, res: Response): Promise<Response> => {
      const id = Number(req.params.id);
      return res.status(204).json(await this.userService.deleteUser(id));
   };
}
