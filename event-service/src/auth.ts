import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

const userServiceUri = process.env.USER_SERVICE_URI || 'http://localhost:3001'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied, no token provided' });
  }

  else try {

    // Call the User Service to verify the token
    const response = await axios.get(`${userServiceUri}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Attach user info to the request
    (req as any).user = response.data;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
