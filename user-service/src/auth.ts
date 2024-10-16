import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).send('Access Denied: No Token Provided');
  }

  else try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};
