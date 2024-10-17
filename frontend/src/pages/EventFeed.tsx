import React, { useEffect, useState } from 'react';
import { eventService } from '../axios';
import EventCard from '../components/EventCard';

export interface Event {
  _id: number;
  title: string;
  description: string;
  date: string;
  comments: Comment[];
  participants: string[];
  createdBy: {
    userId: string;
    username: string;
  }
}

export interface Comment {
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

const EventFeed: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await eventService.get('/events');
        setEvents(eventsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch events or comments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <EventCard
              id={event._id}
              title={event.title}
              description={event.description}
              date={event.date}
              comments={event.comments}
              participants={event.participants}
              createdBy={event.createdBy}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventFeed;
