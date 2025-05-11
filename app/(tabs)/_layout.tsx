import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Animated } from "react-native";
import { useEffect, useRef } from 'react';

export default function TabLayout() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Simple fade-in animation when tabs are first shown
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, []);


  return (
    <Animated.View 
      style={{ 
        flex: 1, 
        opacity: fadeAnim,
        transform: [{
          scale: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1]
          })
        }]
      }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
          tabBarStyle: {
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
          },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // headerTitle: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: 'Loans',
          // headerTitle: 'Loans',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // headerTitle: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          // headerTitle: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
    </Animated.View>
  );
} 