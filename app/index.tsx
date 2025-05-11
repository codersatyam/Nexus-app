import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the authentication flow
  // In a real app, you would check if the user is already logged in here
  // and redirect to the home screen if they are
  return <Redirect href="/auth/phone" />;
}
