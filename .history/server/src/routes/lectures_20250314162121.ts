import express from "express";
import { authenticate } from "../middleware/auth";

import { 
  getLectureRecordings, 
  getLectureRecordingsByModule,
  getLectureRecordingById, 
  createLectureRecording, 
  updateLectureRecording, 
  deleteLectureRecording 
} from '../controllers/lectures';

const router = express.Router();

// Get all lecture recordings for the current user (protected)
router.get('/', authenticate, getLectureRecordings);

// Get lecture recordings by module name (protected)
router.get('/module/:moduleName', authenticate, getLectureRecordingsByModule);

// Get a single lecture recording by ID (protected)
router.get('/:id', authenticate, getLectureRecordingById);

// Create a new lecture recording (protected)
router.post('/', authenticate, createLectureRecording);

// Update a lecture recording (protected)
router.put('/:id', authenticate, updateLectureRecording);

// Delete a lecture recording (protected)
router.delete('/:id', authenticate, deleteLectureRecording);

export default router; 