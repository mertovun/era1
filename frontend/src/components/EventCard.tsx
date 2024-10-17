import React, { useState } from 'react';
import { Comment } from '../pages/EventFeed'; // Import the Comment interface
import './EventCard.css';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../axios';

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  date: string;
  comments: Comment[];
  participants: string[];
  createdBy: {
    userId: string;
    username: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ id, title, description, date, comments, participants, createdBy }) => {
  const { user, token } = useAuth(); 
  const [newComment, setNewComment] = useState<string>(''); 
  const [commentList, setCommentList] = useState<Comment[]>(comments);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await eventService.post(
        `/events/${id}/comments`,
        {
          text: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      const newComments: Comment[] = response.data.event.comments;
      setCommentList((prevComments) => newComments);

      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    }
  };

  return (
    <div className="event-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Participants:</strong> {participants.length}</p>

      <h4>Comments:</h4>
      <ul>
        {commentList.map((comment) => (
          <li key={comment.createdAt}>
            <p><strong>{comment.username}:</strong> {comment.text}</p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      {user && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            required
          />
          <button type="submit">Submit Comment</button>
        </form>
      )}
    </div>
  );
};

export default EventCard;
