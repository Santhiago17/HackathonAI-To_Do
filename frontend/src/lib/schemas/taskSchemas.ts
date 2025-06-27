import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  assignee: z.string().min(1, 'Responsável é obrigatório'),
  creator: z.string().min(1, 'Criador é obrigatório'),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Prioridade é obrigatória'
  }),
  status: z.enum(['todo', 'in-progress', 'review', 'done'], {
    required_error: 'Status é obrigatório'
  }),
  tags: z
    .array(
      z
        .string()
        .min(1, 'Tag não pode estar vazia')
        .max(100, 'Tag deve ter no máximo 100 caracteres')
    )
    .max(10, 'Máximo de 10 tags permitidas')
    .default([]),
  endDate: z
    .string()
    .optional()
    .refine(
      date => {
        if (!date) return true
        const parsedDate = new Date(date)
        return !isNaN(parsedDate.getTime()) && parsedDate >= new Date()
      },
      {
        message: 'Data de término deve ser uma data válida no futuro'
      }
    )
})

export type CreateTaskType = z.infer<typeof createTaskSchema>
