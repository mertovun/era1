import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import Event from './models/Event';
import { verifyToken } from './auth'; // Import the middleware

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

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/event_service_db';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Post Event (Create a new event, requires JWT token)
app.post('/events', verifyToken, async (req: Request, res: Response) => {
  const { title, description, date } = req.body;
  const user = (req as any).user; // User data from the token

  try {
    const event = new Event({
      title,
      description,
      date,
      createdBy: {
        userId: user.id,
        username: user.username
      },
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create event' });
  }
});

// Get Events (Retrieve all events)
app.get('/events', async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

app.put('/events/:id', verifyToken, async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const { title, description, date } = req.body;
  const user = (req as any).user; // User data from the token

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
    }

    // Check if the user is the creator of the event
    else if (event.createdBy!.userId != user.id) {
      res.status(403).json({ error: 'You are not authorized to update this event' });
    }

    // Update event fields
    else {
      if (title) event.title = title;
      if (description) event.description = description;
      if (date) event.date = date;
  
      await event.save();
  
      res.status(200).json({ message: 'Event updated successfully', event });  
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/events/:id', verifyToken, async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const user = (req as any).user; // User data from the token

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
    }

    // Check if the user is the creator of the event
    else if (event.createdBy!.userId && event.createdBy!.userId != user.id) {
      res.status(403).json({ error: 'You are not authorized to delete this event' });
    }

    else {
      // Delete the event
      await Event.findByIdAndDelete(eventId);
      res.status(200).json({ message: 'Event deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

app.post('/events/:id/join', verifyToken, async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const user = (req as any).user; // User data from the token

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
    }

    // Check if the user is already a participant
    else if (event.participants.includes(user.username)) {
      res.status(400).json({ error: 'You are already a participant' });
    }

    // Add user to the participants array
    else {
      event.participants.push(user.username);
      await event.save();
      res.status(200).json({ message: 'Successfully joined the event', event });
    }

  } catch (error) {
    res.status(500).json({ error: 'Failed to join the event' });
  }
});

app.post('/events/:id/unjoin', verifyToken, async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const user = (req as any).user; // User data from the token

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
    }

    // Check if the user is not a participant
    else if (!event.participants.includes(user.username)) {
      res.status(400).json({ error: 'You are not a participant' });
    }

    // Remove user from the participants array
    else {
      event.participants = event.participants.filter(username => username !== user.username);
      await event.save();
  
      res.status(200).json({ message: 'Successfully left the event', event });  
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave the event' });
  }
});

app.post('/events/:id/comments', verifyToken, async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const { text } = req.body;
  const user = (req as any).user; // User data from the token

  if (!text) {
    res.status(400).json({ error: 'Comment text is required' });
  }

  else try {
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
    }

    // Add the comment to the event's comments array
    else {
      const newComment = {
        userId: user.id,
        username: user.username,
        text,
        createdAt: new Date()
      };
  
      event.comments.push(newComment);
      await event.save();
  
      res.status(201).json({ message: 'Comment added successfully', event });  
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Event Service running on port ${PORT}`);
});
