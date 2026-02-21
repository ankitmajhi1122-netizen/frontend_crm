export type { Task, TaskPriority, TaskStatus } from '../../shared/types/task.types';

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: import('../../shared/types/task.types').TaskPriority;
  status: import('../../shared/types/task.types').TaskStatus;
  assignedTo: string;
  relatedTo: string;
}
