import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '~/utils/supabase';

export default function Home() {
  const [eventId, setEventId] = useState('');

  const joinEvent = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .insert({ user_id: 'user-id', event_id: Number(eventId) }) // Ensure event_id is a number
      .select()
      .single();

    if (error) {
      console.error('Error joining event:', error.message);
    } else {
      console.log('Successfully joined event:', data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Meetup App!</Text>
      <Text style={styles.description}>
        This application is designed to help you discover and join events in your area.
      </Text>
      <TextInput
        value={eventId}
        onChangeText={setEventId}
        placeholder="Enter Event ID"
        style={styles.input}
      />
      <Button title="Join Now" onPress={joinEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
});
