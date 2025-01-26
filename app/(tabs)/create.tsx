import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View, TextInput, Button, Pressable, Alert, ScrollView } from 'react-native';

import Avatar from '~/components/Avatar';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

interface User {
  id: string;
  // Add other properties as needed
}

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');

  const [loading, setLoading] = useState(false);

  const { user } = useAuth() as { user: User }; // Type assertion for user

  const createEvent = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('events')
      .insert([{
        title,
        description,
        date,
        user_id: user.id,
        image_uri: imageUrl,
        location,
      }])
      .select()
      .single();

    if (error) {
      Alert.alert('Failed to create the event', error.message);
      setLoading(false);
    } else {
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      console.log(data);
      router.push(`/events/${data.id}`);
    }

    setLoading(false);
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-3 bg-white p-5">
      <View className="items-center ">
        <Avatar
          size={200}
          url={imageUrl}
          onUpload={(url: string) => {
            setImageUrl(url);
          }}
        />
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        className="rounded-md border border-gray-200 p-3"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline
        numberOfLines={3}
        className="min-h-32 rounded-md border border-gray-200 p-3"
      />
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="Date (YYYY-MM-DD)"
        className="rounded-md border border-gray-200 p-3"
      />
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
        className="rounded-md border border-gray-200 p-3"
      />

      <Pressable
        onPress={() => createEvent()}
        disabled={loading}
        className="mt-auto items-center rounded-md bg-red-500 p-3 px-8">
        <Text className="text-lg font-bold text-white">Create event</Text>
      </Pressable>
    </ScrollView>
  );
}
