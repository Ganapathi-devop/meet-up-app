import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Pressable } from 'react-native';
import { RouteProp, NavigationProp } from '@react-navigation/native';
import { supabase } from '~/utils/supabase'; // Ensure this import is present
import { useAuth } from '~/contexts/AuthProvider';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import dayjs from 'dayjs';
import SupaImage from '~/components/SupaImage';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type EventDetailProps = {
  route: RouteProp<{ params: { id: number } }, 'params'>;
  navigation: NavigationProp<any>;
};

const EventDetail: React.FC<EventDetailProps> = ({ route }) => {
  const navigation = useNavigation(); // Access the navigation object here
  const { id } = useLocalSearchParams();

  const [event, setEvent] = useState({
    created_at: '2025-01-26T15:04:51.462994+00:00',
    date: '2024-01-26',
    description: 'Img',
    id: '3a0b526a-20ca-4784-a216-8dfd9a9c39f8',
    image_uri: '1737903838656.jpeg',
    location: 'Chennai',
    room_id: 11,
    title: 'Test with img',
    user_id: 'b2365948-be93-4ba7-8ed6-0cdcbe7d195e',
  });
  const [numberOfAttendees, setNumberOfAttendees] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (event) {
      fetchNumberOfAttendees();
    }
  }, [event?.id]);

  const fetchNumberOfAttendees = async () => {
    const { count } = await supabase
      .from('attendance')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event?.id);

    setNumberOfAttendees(count || 0); // Handle potential null value
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    try {
      console.log(data, error);

      if (error || !data) {
        console.error('Error fetching event:', error);
        setEvent(null);
      }
      if (data) {
        setEvent(data);
      }
    } catch (error) {
      console.error('Error fetching event:', error, 'line 58');
    }
  };

  const { session } = useAuth();
  const handleJoin = async () => {
    try {
      const userId = session?.user?.id; // Replace with actual user ID
      const { data, error } = await supabase
        .from('attendance')
        .insert([{ event_id: id, user_id: userId }]);

      console.log(data, error);
      if (error) {
        console.error('Error joining event:', error);
        throw error;
        return;
      }
      console.log(id, "id in event details")
      const eventId = id
      console.log(eventId)
      router.push(`/events/${eventId}/CommentsPage`);
    } catch (err) {
      console.error('Error joining event:', err);
      Alert.alert(err?.message || err);
    }
  };

  return (
    <View className="flex-1 gap-3 bg-white p-3">
      <Stack.Screen
        options={{ title: 'Event', headerBackTitleVisible: false, headerTintColor: 'black' }}
      />
      {event?.image_uri && (
        <SupaImage path={event?.image_uri} className="aspect-video w-full rounded-xl" />
      )}

      <Text className="text-3xl font-bold" numberOfLines={2}>
        {event.title}
      </Text>
      <Text className="text-lg font-semibold uppercase text-amber-800">
        {dayjs(event.date).format('ddd, D MMM')} · {dayjs(event.date).format('h:mm A')}
      </Text>

      <Text className="text-lg" numberOfLines={2}>
        {event.description}
      </Text>

      <Link href={`/event/${event?.id}/attendance`} className="text-lg" numberOfLines={2}>
        View attendance
      </Link>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t-2 border-gray-300 p-5 pb-10">
        <Text className="text-xl font-semibold">Free</Text>

        <Pressable onPress={() => handleJoin()} className="rounded-md bg-red-500 p-5 px-8">
          <Text className="text-lg font-bold text-white">Join and RSVP</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EventDetail;
