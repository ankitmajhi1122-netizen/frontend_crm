export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'open' | 'in_progress' | 'done';

export interface Task {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  relatedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
