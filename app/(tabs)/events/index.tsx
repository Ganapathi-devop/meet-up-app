import { User } from '@supabase/supabase-js';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

import EventListItem from '~/components/EventListItem';
import { useAuth } from '~/contexts/AuthProvider';
import { useNearbyEvents } from '~/hooks/useNearbyEvents';
import { Attendance } from '~/types/db';

import eventsData from '~/assets/events.json';
import { supabase } from '~/utils/supabase';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth() as { user: User };

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching event:', error);
      // Fallback to assets if event not found
      const assetEvent = eventsData;
      if (assetEvent) {
        console.log('Using asset event:', assetEvent); // Log asset event
        const arrayOfEvents = [];
        assetEvent.forEach((event) => {
          const obj = {
            ...event,
            created_at: new Date().toISOString(),
            date: event.datetime,
            image_uri: event.image,
            location_point: null,
            user_id: null,
            id: Number(event.id),
          };

          arrayOfEvents.push(obj);
        });
        setEvents(arrayOfEvents);
      } else {
        console.log('No asset event found ');
        setEvents(null);
      }
    } else {
      console.log('Fetched event from Supabase:', data);
      setEvents(data);
    }
    setLoading(false);
  };

  if (!events) {
    return <Text>Event not found</Text>;
  }

  return (
    <>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Stack.Screen options={{ title: 'Events' }} />

          <FlatList
            data={events}
            renderItem={({ item }) => <EventListItem event={item} />}
            className="bg-white"
          />
        </>
      )}
    </>
  );
}
