import express from "express";
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
router.get('/', authenticate, getNotes);

// Get public notes (public)
router.get('/public', getPublicNotes);

// Get a single note by ID (protected or public depending on note)
router.get('/:id', authenticate, getNoteById);

// Create a new note (protected)
router.post('/', authenticate, createNote);

// Update a note (protected)
router.put('/:id', authenticate, updateNote);

// Delete a note (protected)
router.delete('/:id', authenticate, deleteNote);

export default router; 