import express from "express";
import { authenticate } from "../middleware/auth";

import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/tasks';

const router = express.Router();

// Get all tasks for the current user (protected)
router.get('/', authenticate, getTasks);

// Get a single task by ID (protected)
router.get('/:id', authenticate, getTaskById);

// Create a new task (protected)
router.post('/', authenticate, createTask);

// Update a task (protected)
router.put('/:id', authenticate, updateTask);

// Delete a task (protected)
router.delete('/:id', authenticate, deleteTask);

export default router; 