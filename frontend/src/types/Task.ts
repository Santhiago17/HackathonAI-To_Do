export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string; // User responsible for the task
  createdAt: Date;
  updatedAt: Date;
  tags: string[]; // Tags associated with the task
}

