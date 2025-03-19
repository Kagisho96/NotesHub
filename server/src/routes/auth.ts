import express, { RequestHandler } from "express";
import { getCurrentUser, login, register } from "../controllers/auth";
import { devLogin } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Register route
router.post('/register', register as RequestHandler);

// Login route
router.post('/login', login as RequestHandler);

// Get current user route (protected)
router.get('/me', authenticate as RequestHandler, getCurrentUser as RequestHandler);

// Dev login route
router.post('/dev-login', devLogin);

export default router; 