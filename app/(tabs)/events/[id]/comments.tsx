import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '~/utils/supabase';
import { Comment } from '~/types/supabase'; // Import the Comment type

interface CommentsProps {
  eventId: string; // Explicitly type the eventId prop
}

export default function Comments({ eventId }: CommentsProps) {
  const [messages, setMessages] = useState<Comment[]>([]); // Define the state type
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<Comment>('comments') // Ensure the correct table is referenced
      .select('*')
      .eq('event_id', Number(eventId)); // Ensure event_id is a number

    if (error) {
      console.error('Error fetching messages:', error.message);
      Alert.alert('Error fetching messages', error.message); // Alert for error
    } else {
      setMessages(data);
    }
    setLoading(false); // Set loading to false after fetching
  };

  const sendMessage = async () => {
    const { error } = await supabase
      .from('comments') // Ensure the correct table is referenced
      .insert([{ event_id: Number(eventId), message: newMessage }]);

    if (error) {
      console.error('Error sending message:', error.message);
      Alert.alert('Error sending message', error.message); // Alert for error
    } else {
      setNewMessage('');
      fetchMessages(); // Refresh messages after sending
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {loading ? ( // Show loading indicator while fetching
        <ActivityIndicator />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Text style={styles.message}>{item.message}</Text>}
        />
      )}
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type your message"
        style={styles.input}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
});
