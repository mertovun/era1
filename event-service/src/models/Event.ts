import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  participants: { type: [String], default: [] }, 
  createdBy: {
    userId: { type: String, required: true },
    username: { type: String, required: true },
  },
  comments: { type: [commentSchema], default: [] } 
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;
