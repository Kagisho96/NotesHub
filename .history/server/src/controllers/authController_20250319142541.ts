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