import { Request, Response } from "express";
import { prisma } from "../index";

// Get all tasks for the current user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user?.id
      },
      orderBy: [
        {
          dueDate: 'asc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: {
        id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the task belongs to the user
    if (task.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    // Validate input
    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Please provide title and due date' });
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority: priority || 'medium',
        userId: req.user?.id as string
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed, priority } = req.body;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: {
        id
      }
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (existingTask.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: {
        id
      },
      data: {
        title: title || existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
        completed: completed !== undefined ? completed : existingTask.completed,
        priority: priority || existingTask.priority
      }
    });

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if task exists and belongs to user
    const task = await prisma.task.findUnique({
      where: {
        id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    // Delete task
    await prisma.task.delete({
      where: {
        id
      }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 