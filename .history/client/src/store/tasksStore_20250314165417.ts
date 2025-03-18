import tasksService, { CreateTaskData, Task, UpdateTaskData } from "../services/tasks";
import { create } from "zustand";

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  createTask: (taskData: CreateTaskData) => Promise<void>;
  updateTask: (id: string, taskData: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearCurrentTask: () => void;
  clearError: () => void;
}

const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  
  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await tasksService.getTasks();
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch tasks',
        isLoading: false 
      });
    }
  },
  
  fetchTaskById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const task = await tasksService.getTaskById(id);
      set({ currentTask: task, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch task',
        isLoading: false 
      });
    }
  },
  
  createTask: async (taskData: CreateTaskData) => {
    try {
      set({ isLoading: true, error: null });
      const newTask = await tasksService.createTask(taskData);
      set(state => ({ 
        tasks: [newTask, ...state.tasks],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create task',
        isLoading: false 
      });
    }
  },
  
  updateTask: async (id: string, taskData: UpdateTaskData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedTask = await tasksService.updateTask(id, taskData);
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id ? updatedTask : task
        ),
        currentTask: updatedTask,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update task',
        isLoading: false 
      });
    }
  },
  
  deleteTask: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await tasksService.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete task',
        isLoading: false 
      });
    }
  },
  
  clearCurrentTask: () => set({ currentTask: null }),
  
  clearError: () => set({ error: null })
}));

export default useTasksStore; 