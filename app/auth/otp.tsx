import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Dummy OTP for testing
const CORRECT_OTP = '123456';

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const loadingAnim = useRef(new Animated.Value(0)).current;
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const bubbleAnim1 = useRef(new Animated.Value(0)).current;
  const bubbleAnim2 = useRef(new Animated.Value(0)).current;
  const bubbleAnim3 = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Background animations
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

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

    // Timer countdown
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 30000,
      useNativeDriver: false,
    }).start();
    
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    // Update the OTP array with the new value
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // If a digit was entered (not deleted) and we're not at the last input, focus the next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace - when current field is empty, focus previous field
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return '';
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  };

  const handleResendOtp = () => {
    // Reset timer and OTP
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    
    // Focus first input
    inputRefs.current[0]?.focus();
    
    Alert.alert('OTP Resent', `A new OTP has been sent to ${formatPhoneNumber(phone)}`);
  };

  // Animation for the loading indicator
  const startLoadingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp === CORRECT_OTP) {
      // Show loading state
      setIsVerifying(true);
      startLoadingAnimation();
      
      // Simulate verification delay (remove in production and replace with actual API call)
      setTimeout(() => {
        // OTP is correct, navigate to home screen
        router.replace('/(tabs)');
      }, 1500); // Add a slight delay for the animation to be visible
    } else {
      // OTP is incorrect
      Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Loading overlay */}
      {isVerifying && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Animated.View style={[styles.loadingIndicator, {
              opacity: loadingAnim
            }]} />
            <Text style={styles.loadingText}>Verifying...</Text>
          </View>
        </View>
      )}
      <LinearGradient
        colors={['rgba(7, 66, 154, 0.8)', 'rgba(25, 118, 210, 0.6)', 'rgba(72, 147, 244, 0.4)']}
        style={styles.background}
      >
        {/* Animated bubbles */}
        <Animated.View style={[
          styles.bubble,
          styles.bubble1,
          { 
            opacity: bubbleAnim1,
            transform: [{ translateY: bubbleAnim1.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -100]
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
              outputRange: [0, -120]
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
              outputRange: [0, -80]
            })}]
          }
        ]} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          {/* <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>OTP Verification</Text>
          </View> */}
          
          <Animated.View 
            style={[styles.contentContainer, { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }]}
          >
            <View style={styles.card}>
              <Text style={styles.title}>Verify your number</Text>
              <Text style={styles.subtitle}>
                We've sent a verification code to{' '}
                <Text style={styles.phoneText}>{formatPhoneNumber(phone)}</Text>
              </Text>
              
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text.replace(/[^0-9]/g, ''), index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="oneTimeCode"
                    returnKeyType="next"
                    placeholder="•"
                    placeholderTextColor="#ccc"
                  />
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.button}
                onPress={verifyOtp}
                disabled={otp.join('').length < 6 || isVerifying}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={otp.join('').length === 6 ? 
                    ['#1976D2', '#2196F3', '#1976D2'] : 
                    ['#1976D2', '#1976D2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>
                    {otp.join('').length === 6 ? 'Verify OTP' : 'Enter Complete OTP'}
                  </Text>
                </LinearGradient>
                
                <View style={styles.progressContainer}>
                  <View 
                    style={[styles.progressBar, { width: `${Math.min(otp.join('').length * 16.67, 100)}%` }]} 
                  />
                </View>
              </TouchableOpacity>
              
              {!canResend && (
                <View style={styles.timerContainer}>
                  <Animated.View style={[styles.timerProgress, {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }]} />
                  <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
                </View>
              )}
              
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                {canResend ? (
                  <TouchableOpacity onPress={handleResendOtp}>
                    <Text style={styles.resendButton}>Resend OTP</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.disabledResendText}>Wait for timer</Text>
                )}
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(21, 101, 192, 0.9)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    width: 200,
    height: 200,
  },
  loadingIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1976D2',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#1565C0',
    fontWeight: '600',
    marginTop: 10,
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976D2',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
    textAlign: 'center',
  },
  phoneText: {
    fontWeight: '600',
    color: '#1976D2',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 55,
    borderWidth: 1.5,
    borderColor: '#1976D2',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  button: {
    overflow: 'hidden',
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  timerContainer: {
    backgroundColor: '#f0f0f0',
    height: 40,
    borderRadius: 20,
    marginTop: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  timerProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(25, 118, 210, 0.2)',
  },
  timerText: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 40,
    color: '#666',
    fontWeight: '500',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendButton: {
    fontSize: 15,
    color: '#1976D2',
    fontWeight: '700',
  },
  disabledResendText: {
    fontSize: 14,
    color: '#aaa',
    fontStyle: 'italic',
  },
  // Bubble animations
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
  },
  bubble1: {
    width: 60,
    height: 60,
    bottom: 50,
    left: '20%',
  },
  bubble2: {
    width: 80,
    height: 80,
    bottom: 40,
    left: '50%',
  },
  bubble3: {
    width: 40,
    height: 40,
    bottom: 80,
    left: '70%',
  },
});
