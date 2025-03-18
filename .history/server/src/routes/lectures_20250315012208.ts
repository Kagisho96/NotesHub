import express, { RequestHandler } from "express";
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
router.get('/', authenticate as RequestHandler, getLectureRecordings as RequestHandler);

// Get lecture recordings by module name (protected)
router.get('/module/:moduleName', authenticate as RequestHandler, getLectureRecordingsByModule as RequestHandler);

// Get a single lecture recording by ID (protected)
router.get('/:id', authenticate as RequestHandler, getLectureRecordingById as RequestHandler);

// Create a new lecture recording (protected)
router.post('/', authenticate as RequestHandler, createLectureRecording as RequestHandler);

// Update a lecture recording (protected)
router.put('/:id', authenticate as RequestHandler, updateLectureRecording as RequestHandler);

// Delete a lecture recording (protected)
router.delete('/:id', authenticate as RequestHandler, deleteLectureRecording as RequestHandler);

export default router; 