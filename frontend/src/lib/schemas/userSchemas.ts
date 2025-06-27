import { z } from 'zod'

export const createUserSchema = z.object({
  firstName: z.string().min(1, { message: 'Primeiro nome é obrigatório.' }),
  lastName: z.string().min(1, { message: 'Último nome é obrigatório.' }),
  birthDate: z
    .string()
    .min(8, { message: 'Data de nascimento deve ter 8 caracteres (YYYYMMDD).' })
    .max(8, { message: 'Data de nascimento deve ter 8 caracteres (YYYYMMDD).' })
})

export const updateUserSchema = z.object({
  firstName: z.string().min(1, { message: 'Primeiro nome é obrigatório.' }),
  lastName: z.string().min(1, { message: 'Último nome é obrigatório.' }),
  birthDate: z
    .string()
    .min(8, { message: 'Data de nascimento deve ter 8 caracteres (YYYYMMDD).' })
    .max(8, { message: 'Data de nascimento deve ter 8 caracteres (YYYYMMDD).' })
})

export type CreateUserType = z.infer<typeof createUserSchema>
export type UpdateUserType = z.infer<typeof updateUserSchema>
