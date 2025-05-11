import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PhoneScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const bubbleAnim1 = useRef(new Animated.Value(0)).current;
  const bubbleAnim2 = useRef(new Animated.Value(0)).current;
  const bubbleAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Slide up the content
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate the bubbles continuously
    const animateBubbles = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(bubbleAnim1, {
              toValue: 1,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(bubbleAnim2, {
              toValue: 1,
              duration: 3000, 
              useNativeDriver: true,
            }),
            Animated.timing(bubbleAnim3, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(bubbleAnim1, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(bubbleAnim2, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(bubbleAnim3, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animateBubbles();
  }, []);

  const validatePhoneNumber = (number: string) => {
    // Basic validation for Indian phone numbers (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleContinue = () => {
    if (validatePhoneNumber(phoneNumber)) {
      setIsValid(true);
      // Navigate to OTP screen with phone number as parameter
      router.push({
        pathname: '/auth/otp',
        params: { phone: phoneNumber }
      });
    } else {
      setIsValid(false);
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit mobile number');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(7, 66, 154, 0.9)', 'rgba(25, 118, 210, 0.8)', 'rgba(72, 147, 244, 0.7)']}
        style={styles.background}
      >
        {/* Upper Part - App Name and Bubbles */}
        <View style={styles.upperPart}>
          {/* App Logo/Name */}
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1]
              })
            }]
          }}>
            <Text style={styles.appName}>TrueCredit</Text>
            <Text style={styles.appTagline}>Your Financial Partner</Text>
          </Animated.View>

          {/* Animated bubbles */}
          <Animated.View style={[
            styles.bubble,
            styles.bubble1,
            { 
              opacity: bubbleAnim1,
              transform: [{ translateY: bubbleAnim1.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60]
              })}]
            }
          ]} />
          <Animated.View style={[
            styles.bubble,
            styles.bubble2,
            { 
              opacity: bubbleAnim2,
              transform: [{ translateY: bubbleAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -80]
              })}]
            }
          ]} />
          <Animated.View style={[
            styles.bubble,
            styles.bubble3,
            { 
              opacity: bubbleAnim3,
              transform: [{ translateY: bubbleAnim3.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -50]
              })}]
            }
          ]} />
        </View>

        {/* Lower Part - Phone Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.lowerPart}
        >
          <Animated.View 
            style={[styles.contentContainer, { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }]}
          >
            <View style={styles.card}>
              <Text style={styles.welcomeText}>Welcome!</Text>
              <Text style={styles.subtitle}>Enter your phone number to continue</Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, !isValid && styles.inputError]}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    if (!isValid) setIsValid(true);
                  }}
                  placeholderTextColor="#999"
                />
              </View>
              
              {!isValid && (
                <Text style={styles.errorText}>Please enter a valid 10-digit mobile number</Text>
              )}

              <View style={styles.buttonWrapper}>
                {/* Add shimmer effect to the button when disabled */}
                {phoneNumber.length < 10 && (
                  <View style={styles.buttonOverlay} />
                )}
                
                <TouchableOpacity 
                  style={styles.button}
                  onPress={handleContinue}
                  disabled={phoneNumber.length < 10}
                  activeOpacity={0.7}
                >
                  <Text style={styles.buttonText}>
                    {phoneNumber.length < 10 ? 'Continue' : 'Continue'}
                  </Text>
                  
                  {/* Show progress indicator based on input length */}
                  <View style={styles.progressContainer}>
                    <View 
                      style={[styles.progressBar, { width: `${Math.min(phoneNumber.length * 10, 100)}%` }]} 
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Upper Part Styles
  upperPart: {
    height: '40%', // Takes 40% of the screen
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  appTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 5,
    letterSpacing: 1,
  },
  // Lower Part Styles
  lowerPart: {
    height: '60%', // Takes 60% of the screen
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.93)',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976D2',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  input: {
    fontSize: 18,
    paddingVertical: 12,
    color: '#333',
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
  },
  buttonWrapper: {
    position: 'relative',
    width: '100%',
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 1,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 56,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  // Bubble animations
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
  },
  bubble1: {
    width: 70,
    height: 70,
    top: '30%',
    left: '15%',
  },
  bubble2: {
    width: 90,
    height: 90,
    top: '40%',
    right: '20%',
  },
  bubble3: {
    width: 50,
    height: 50,
    top: '20%',
    right: '30%',
  },
});
