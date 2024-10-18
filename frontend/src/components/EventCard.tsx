import React, { useState } from 'react';
import { Comment } from '../pages/EventFeed';
import './EventCard.css';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../axios';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState<string>(''); 
  const [commentList, setCommentList] = useState<Comment[]>(comments);
  const [participantList, setParticipantList] = useState<string[]>(participants);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedTitle, setUpdatedTitle] = useState<string>(title);
  const [updatedDescription, setUpdatedDescription] = useState<string>(description);
  const [updatedDate, setUpdatedDate] = useState<string>(date);

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
      setCommentList(newComments);

      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    }
  };

  const isUserParticipant = participantList.includes(user?.username || '');

  const handleJoin = async () => {
    try {
      const response = await eventService.post(
        `/events/${id}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedParticipants: string[] = response.data.event.participants;
      setParticipantList(updatedParticipants);
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Failed to join event');
    }
  };

  const handleUnjoin = async () => {
    try {
      const response = await eventService.post(
        `/events/${id}/unjoin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedParticipants: string[] = response.data.event.participants;
      setParticipantList(updatedParticipants);
    } catch (error) {
      console.error('Error unjoining event:', error);
      alert('Failed to unjoin event');
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return; 
    }

    try {
      await eventService.delete(`/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Event deleted successfully');
      navigate('/'); 
      window.location.reload();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await eventService.put(
        `/events/${id}`,
        {
          title: updatedTitle,
          description: updatedDescription,
          date: new Date(updatedDate).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditing(false);
      setUpdatedTitle(response.data.event.title);
      setUpdatedDescription(response.data.event.description);
      setUpdatedDate(response.data.event.date);

      alert('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event');
    }
  };

  return (
    <div className="event-card">

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-event-form">
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <input
            type="datetime-local"
            value={new Date(updatedDate).toISOString().slice(0, 16)}
            onChange={(e) => setUpdatedDate(e.target.value)}
            required
          />
          <button type="submit">Update Event</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h3>{updatedTitle}</h3>


          {user && (
            isUserParticipant ? (
              <button onClick={handleUnjoin} className="unjoin-button">
                Unjoin Event
              </button>
            ) : (
              <button onClick={handleJoin} className="join-button">
                Join Event
              </button>
            )
          )}


          {user?.username === createdBy.username && (
            <>
              <button onClick={() => setIsEditing(true)} className="edit-button">
                Edit Event
              </button>
              <button onClick={handleDeleteEvent} className="delete-button">
                Delete Event
              </button>
            </>
          )}

          <p>{updatedDescription}</p>
          <p><strong>Date:</strong> {updatedDate}</p>
          <p><strong>Participants:</strong> {participantList.length}</p>
        </>
      )}

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
