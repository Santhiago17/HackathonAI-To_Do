import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório." }),
  email: z.string().email({ message: "Email inválido." }).min(1, { message: "Email é obrigatório." }),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres." }),
});

export type CreateUserType = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório." }).optional(),
  email: z.string().email({ message: "Email inválido." }).min(1, { message: "Email é obrigatório." }).optional(),
  // Password is not updated via this form as per user request
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;
