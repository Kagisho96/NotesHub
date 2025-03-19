import jwt from "jsonwebtoken";
import { Request, Response } from "express";

// Get JWT secret from environment variables or use a default value
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const devLogin = async (req: Request, res: Response) => {
  try {
    // Create a test user token
    const token = jwt.sign(
      { id: '1', email: 'test@example.com' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return token and demo user data
    res.status(200).json({
      message: 'Dev login successful',
      token,
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }
    });
  } catch (error) {
    console.error('Dev login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 