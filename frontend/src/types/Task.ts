export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'review' | 'done'; 

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  creator: string;
  tags: string[];

  createdAt: Date;
  updatedAt: Date;

  endDate?: string;
}