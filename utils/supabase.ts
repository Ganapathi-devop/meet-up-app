import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';
import { Comment } from '~/types/db'; // Ensure Comment type is imported

const supabaseUrl = process.env.SUPABASE_URL || 'https://yupsqfzcywjxaeowchkc.supabase.co';
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cHNxZnpjeXdqeGFlb3djaGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyOTEwMjksImV4cCI6MjA1Mjg2NzAyOX0.PzG1KtZrQ-wTJiXyfnNRpxP1-oY6YvslFRDJlYCuxJY';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cHNxZnpjeXdqeGFlb3djaGtjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzI5MTAyOSwiZXhwIjoyMDUyODY3MDI5fQ.kMfG8gazm0QpMgVXqnE5eoqV9_MYHrEdwC9ZKuGAZl8';

console.log(supabaseUrl, supabaseServiceKey);
export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Function to fetch comments for a specific event
export const fetchComments = async (eventId: number | string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  return data as Comment[];
};

// Function to post a new comment
export const postComment = async (
  eventId: number,
  userId: string,
  content: string
): Promise<Comment | null> => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ event_id: eventId, user_id: userId, content }]);

  if (error) {
    console.error('Error posting comment:', error);
    return null;
  }
  return data as Comment;
};
