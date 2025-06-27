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
  tags: z.array(z.string()).default([]),
  endDate: z.string().optional()
})

export type CreateTaskType = z.infer<typeof createTaskSchema>
