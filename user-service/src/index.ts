import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import cors from 'cors';
import pool from './db';
import dotenv from 'dotenv';
import { verifyToken } from './auth';

dotenv.config();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: process.env.REACT_APP_URI || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, };

app.use(cors(corsOptions));

app.use(morgan('combined')); 

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';


app.post('/auth/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );
    console.log('User registered successfully');
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const correctPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!user.rows[0] || !correctPassword) {
    res.status(401).send('Invalid credentials');
  }
  else {
    const token = jwt.sign({ id: user.rows[0].id }, JWT_SECRET);
    res.json({ token, userId: user.rows[0].id, username: user.rows[0].username });
  }
});

app.get('/auth/verify', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [userId]);

    if (!user.rows[0]) {
      res.status(404).send('User not found');
    }

    else res.json(user.rows[0]);
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).send('Error verifying token');
 
  } });

app.listen(3001, () => console.log('User Service running on port 3001'));
