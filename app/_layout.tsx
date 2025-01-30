import '../global.css';

import { Stack } from 'expo-router';

import AuthProvider from '~/contexts/AuthProvider';
import CommentsPage from './(tabs)/events/[id]/CommentsPage';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        {/* Re-adding CommentsPage as a separate route */}
      </Stack>
    </AuthProvider>
  );
}
