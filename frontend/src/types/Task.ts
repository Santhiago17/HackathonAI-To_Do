// src/types/Task.ts

export type Priority = 'low' | 'medium' | 'high'; // Prioridades em minúsculas
export type Status = 'todo' | 'in-progress' | 'review' | 'done'; // Status conforme sua definição

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string; // ID do usuário responsável pela tarefa (string)
  creator: string; // <-- ADICIONADO: ID do usuário criador (string). É obrigatório no backend.
  tags: string[]; // Tags associadas à tarefa

  // Campos de data e hora
  createdAt: Date;
  updatedAt: Date;

  // endDate: Campo opcional, se seu backend o tiver e você quiser representá-lo no frontend.
  // Se não estiver no backend ou se não for usado no frontend, pode remover.
  endDate?: string; // Data de término, pode vir como string YYYY-MM-DD do backend
}