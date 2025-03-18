import express, { RequestHandler } from "express";
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
router.get('/', authenticate as RequestHandler, getTasks as RequestHandler);

// Get a single task by ID (protected)
router.get('/:id', authenticate as RequestHandler, getTaskById as RequestHandler);

// Create a new task (protected)
router.post('/', authenticate as RequestHandler, createTask as RequestHandler);

// Update a task (protected)
router.put('/:id', authenticate as RequestHandler, updateTask as RequestHandler);

// Delete a task (protected)
router.delete('/:id', authenticate as RequestHandler, deleteTask as RequestHandler);

export default router; 