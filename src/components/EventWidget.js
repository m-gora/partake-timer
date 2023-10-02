import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser, faLocationDot } from '@fortawesome/free-solid-svg-icons'

const EventWidget = ({teamId}) => {
  const GET_EVENTS = gql`
  {
    events(teamId: ${teamId}) {
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
    "title": {
      fontFace: "bold",
      
    },
    "container" : {
      position: 'relative',
      overflow: 'hidden'
    },
  }


  return (
    <div style={styles.container}>{countdown}</div>
  );
};

export default EventWidget;