import dayjs from 'dayjs';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, Image, Pressable, ActivityIndicator } from 'react-native';

import SupaImage from '~/components/SupaImage';
import { useAuth } from '~/contexts/AuthProvider';
import { Attendance, Event } from '~/types/db';
import { supabase } from '~/utils/supabase';
import eventsData from '~/assets/events.json'; // Assuming events are stored in a JSON file

interface User {
  id: string;
  // Add other properties as needed
}

export default function EventPage() {
  const { id } = useLocalSearchParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth() as { user: User }; // Type assertion for user

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    
    if (error || !data) {
      console.error('Error fetching event:', error);
      // Fallback to assets if event not found
      const assetEvent = eventsData.find((event) => event.id === id);
      if (assetEvent) {
        console.log('Using asset event:', assetEvent); // Log asset event
        setEvent({
          ...assetEvent,
          created_at: new Date().toISOString(), // Default value
          date: assetEvent.datetime, // Assuming datetime is the event date
          image_uri: assetEvent.image, // Assuming image is the event image
          location_point: null, // Default value
          user_id: null, // Default value
          id: Number(assetEvent.id), // Convert id to number
        });
      } else {
        console.log('No asset event found for id:', id); // Log if no asset event found
        setEvent(null);
      }
    } else {
      console.log('Fetched event from Supabase:', data); // Log fetched event
      setEvent(data);
    }

    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_id', id)
      .single();
    setAttendance(attendanceData);

    setLoading(false);
  };

  const joinEvent = async () => {
    if (!event?.id) return; // Ensure event.id is defined

    const { data, error } = await supabase
      .from('attendance')
      .insert({ user_id: user.id, event_id: event.id })
      .select()
      .single();

    if (error) {
      console.error('Error joining event:', error); // Log error if joining fails
    } else {
      setAttendance(data);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <View className="flex-1 gap-3 bg-white p-3">
      <Stack.Screen
        options={{ title: 'Event', headerBackTitleVisible: false, headerTintColor: 'black' }}
      />
      {event.image_uri && (
        <SupaImage path={event.image_uri} className="aspect-video w-full rounded-xl" />
      )}

      <Text className="text-3xl font-bold" numberOfLines={2}>
        {event.title}
      </Text>
      <Text className="text-lg font-semibold uppercase text-amber-800">
        {dayjs(event.date).format('ddd, D MMM')} · {dayjs(event.date).format('h:mm A')}
      </Text>

      <Text className="text-lg font-bold">{event.location}</Text>

      <Text className="text-lg" numberOfLines={2}>
        {event.description}
      </Text>

      <Link href={`/event/${event.id}/attendance`} className="text-lg" numberOfLines={2}>
        View attendance
      </Link>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t-2 border-gray-300 p-5 pb-10">
        <Text className="text-xl font-semibold">Free</Text>

        {attendance ? (
          <Text className="font-bold text-green-500">You are attending</Text>
        ) : (
          <Pressable onPress={() => joinEvent()} className="rounded-md bg-red-500 p-5 px-8">
            <Text className="text-lg font-bold text-white">Join and RSVP</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
