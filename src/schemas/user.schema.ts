import z from 'zod';

export const userSchema = z.object({
   id: z.number(),
   firstName: z.string(),
   lastName: z.string(),
   email: z.string().email(),
   password: z.string(),
   createdAt: z.date(),
   updatedAt: z.date()
});

export const createUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const createUserSchemaReturn = userSchema.omit({ password: true, updatedAt: true });

export const loginUserSchema = userSchema.pick({ password: true, email: true });
export const loginUserSchemaReturn = userSchema.omit({ password: true });

export const userSchemaReturn = userSchema.omit({ password: true }).array();

export const updateSchemaReturn = userSchema.omit({ password: true });
