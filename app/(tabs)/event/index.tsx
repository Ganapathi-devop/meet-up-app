import { useEffect, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import { supabase } from '~/utils/supabase';
import { Event } from '~/types/db'; // Import Event type for type safety
import { useRouter } from 'expo-router';

export default function EventList() {
  console.log('EventList rendered'); // Log to confirm rendering

  const [events, setEvents] = useState<Event[]>([]); // Ensure events state is typed
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("event page loaded")
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    console.log('Fetching events...'); // Log when fetching starts
    const { data, error } = await supabase.from('events').select('*');

    if (error) {
      Alert.alert('Failed to fetch events', error.message);
      console.error('Error fetching events:', error);
    } else {
      console.log('Fetched events:', data); // Log the fetched data
      setEvents(data);
    }

    if (!data) {
      console.warn('No events found'); // Log if no events are found
    }
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!events || events.length === 0) {
    return <Text>No events available</Text>; // Fallback for empty events
  }

  return (
    <View>
      <Text>Event List</Text> {/* Default title to verify rendering */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()} // Ensure the ID is a string
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/event/${item.id}`)}>
            <Text>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
