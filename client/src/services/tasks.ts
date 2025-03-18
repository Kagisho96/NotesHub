import api from "./api";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

const tasksService = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get<{ tasks: Task[] }>('/tasks');
      return response.data.tasks;
    } catch (error) {
      throw error;
    }
  },
  
  getTaskById: async (id: string): Promise<Task> => {
    try {
      const response = await api.get<{ task: Task }>(`/tasks/${id}`);
      return response.data.task;
    } catch (error) {
      throw error;
    }
  },
  
  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    try {
      const response = await api.post<{ task: Task, message: string }>('/tasks', taskData);
      return response.data.task;
    } catch (error) {
      throw error;
    }
  },
  
  updateTask: async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    try {
      const response = await api.put<{ task: Task, message: string }>(`/tasks/${id}`, taskData);
      return response.data.task;
    } catch (error) {
      throw error;
    }
  },
  
  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default tasksService; 