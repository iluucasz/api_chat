import z from 'zod';
import {
   createUserSchema,
   createUserSchemaReturn,
   loginUserSchema,
   loginUserSchemaReturn,
   updateSchemaReturn,
   userSchemaReturn
} from '../schemas/user.schema';

export type TCreateUser = z.infer<typeof createUserSchema>;
export type TCreateUserReturn = z.infer<typeof createUserSchemaReturn>;

export type TLoginUser = z.infer<typeof loginUserSchema>;
export type TLoginUserReturn = {
   token: string;
   user: z.infer<typeof loginUserSchemaReturn>;
};

export type TUserReturn = z.infer<typeof userSchemaReturn>;

export type TUpdateReturn = z.infer<typeof updateSchemaReturn>;
