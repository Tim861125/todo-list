export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: TodoPriority
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface TodoFormData {
  title: string
  description?: string
  priority: TodoPriority
  dueDate?: string
}
