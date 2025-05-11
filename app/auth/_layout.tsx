import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="phone" options={{ title: 'Phone Login' }} />
      <Stack.Screen name="otp" options={{ title: 'OTP Verification' }} />
    </Stack>
  );
}
