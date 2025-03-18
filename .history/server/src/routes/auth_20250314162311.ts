import express from "express";
import { getCurrentUser, login, register } from "../controllers/auth";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user route (protected)
router.get('/me', authenticate, getCurrentUser);

export default router; 