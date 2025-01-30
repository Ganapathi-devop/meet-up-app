import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { fetchComments, postComment } from '~/utils/supabase'; // Ensure this import is present
import { Comment } from '~/types/db'; // Ensure Comment type is imported
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';

type CommentsPageProps = {
  route: {
    params: {
      eventId: number;
    };
  };
};

const CommentsPage: React.FC<CommentsPageProps> = () => {
    const { eventId } = useLocalSearchParams();

  const { session } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments(eventId);
      setComments(fetchedComments);
    };
    loadComments();
  }, [eventId]);

  const handlePostComment = async () => {
    const userId = session?.user?.id;
    console.log(eventId, userId, 'ids');
    const postedComment = await postComment(eventId, userId, newComment);
    if (postedComment) {
      setComments([...comments, postedComment]);
      setNewComment('');
    }
  };

  return (
    <View>
      <Text>Comments for Event ID: {eventId}</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <TextInput value={newComment} onChangeText={setNewComment} placeholder="Add a comment" />
      <Button title="Post Comment" onPress={handlePostComment} />
    </View>
  );
};

export default CommentsPage;
