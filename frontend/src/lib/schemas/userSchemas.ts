import { z } from 'zod'

export const createUserSchema = z.object({
  firstName: z.string().min(1, { message: 'Primeiro nome é obrigatório.' }),
  lastName: z.string().min(1, { message: 'Último nome é obrigatório.' }),
  birthDate: z
    .string()
    .min(10, {
      message: 'Data de nascimento deve estar no formato MM/DD/YYYY.'
    })
    .max(10, {
      message: 'Data de nascimento deve estar no formato MM/DD/YYYY.'
    })
    .refine(
      value => {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
        const match = value.match(dateRegex)

        if (!match) {
          return false
        }

        const [, monthStr, dayStr, yearStr] = match
        const month = parseInt(monthStr, 10)
        const day = parseInt(dayStr, 10)
        const year = parseInt(yearStr, 10)

        if (year < 1900 || year > new Date().getFullYear() - 8) {
          return false
        }

        if (month < 1 || month > 12) {
          return false
        }

        const daysInMonth = new Date(year, month, 0).getDate()
        return day >= 1 && day <= daysInMonth
      },
      { message: 'Data de nascimento inválida. Use o formato MM/DD/YYYY.' }
    )
})

export const updateUserSchema = z.object({
  firstName: z.string().min(1, { message: 'Primeiro nome é obrigatório.' }),
  lastName: z.string().min(1, { message: 'Último nome é obrigatório.' }),
  birthDate: z
    .string()
    .min(10, {
      message: 'Data de nascimento deve estar no formato MM/DD/YYYY.'
    })
    .max(10, {
      message: 'Data de nascimento deve estar no formato MM/DD/YYYY.'
    })
})

export type CreateUserType = z.infer<typeof createUserSchema>
export type UpdateUserType = z.infer<typeof updateUserSchema>
