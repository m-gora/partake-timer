import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

// Define the GraphQL query
const GET_EVENTS = gql`
  {
    events(teamId: 523) {
      title
      location
      startsAt
      attendeeCount
      attachments
      locationData {
        dataCenter {
          name
        }
        server {
          name
        }
      }
    }
  }
`;

const EventWidget = () => {
  const { loading, error, data } = useQuery(GET_EVENTS);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!loading && data && data.events.length > 0) {
      setBackgroundImage(data.events[0].attachments[0]);
      // Calculate the countdown based on the "startsAt" time
      calculateCountdown(data.events[0].startsAt);
    }
  }, [loading, data]);

  const calculateCountdown = (startsAt) => {
    const targetTime = new Date(startsAt).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setCountdown('Event has started!');
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

const styles = {
  "container" : {
    position: 'relative',
    width: '100%',
    height: '400px',
  },
  "bg" : {
    position: 'absolute',
    top: 0,
    left: 0,
    maxHeight: '400px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 1,
    setBackgroundImage: `url(https://cdn.partyverse.app/attachments/${backgroundImage})`
  },
  "overlay": {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: 'white',
    fontSize: '20px',
    zIndex: 2,
    fontWeight: 'bold',
  }
};

  return (
    <div style={styles.container}>
      <img style={styles.bg} src={`https://cdn.partyverse.app/attachments/${backgroundImage}`}></img>
      <div style={styles.overlay}>
        <h3 style={{ color: 'pink'}}>{data.events[0].title}</h3>
        <p>C: {countdown}</p>
        <p>A: {data.events[0].attendeeCount}</p>
        <p>L: {data.events[0].locationData.server.name} - {data.events[0].location}</p>
      </div>
    </div>
  );
};

export default EventWidget;