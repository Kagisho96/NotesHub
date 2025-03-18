import express, { RequestHandler } from "express";
import { authenticate } from "../middleware/auth";

import { 
  getNotes, 
  getPublicNotes, 
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote 
} from '../controllers/notes';

const router = express.Router();

// Get all notes for the current user (protected)
router.get('/', authenticate as RequestHandler, getNotes as RequestHandler);

// Get public notes (public)
router.get('/public', getPublicNotes as RequestHandler);

// Get a single note by ID (protected or public depending on note)
router.get('/:id', authenticate as RequestHandler, getNoteById as RequestHandler);

// Create a new note (protected)
router.post('/', authenticate as RequestHandler, createNote as RequestHandler);

// Update a note (protected)
router.put('/:id', authenticate as RequestHandler, updateNote as RequestHandler);

// Delete a note (protected)
router.delete('/:id', authenticate as RequestHandler, deleteNote as RequestHandler);

export default router; 