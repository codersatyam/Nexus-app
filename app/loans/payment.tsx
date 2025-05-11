import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Image,
  Switch,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type PaymentStatus = 'inputting' | 'processing' | 'success' | 'failure';
type PaymentMode = 'upi_id' | 'qr_code';

type PaymentApp = {
  name: string;
  packageName: string; // Android package name
  uriScheme: string;  // iOS URL scheme
  icon: string;
  color: string;
  installed: boolean;
};

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    loanId: string;
    loanTitle: string;
    amountDue: string;
    dueDate: string;
  }>();

  // Get params with defaults
  const loanId = params.loanId || '0';
  const loanTitle = params.loanTitle || 'Loan Payment';
  const amountDue = parseFloat(params.amountDue || '0');
  const dueDate = params.dueDate || 'Today';

  // Development mode flag - set to true during development
  const DEVELOPER_MODE = true; // Set to false for production

  // State for payment information
  const [amount, setAmount] = useState(amountDue.toString());
  const [formattedAmount, setFormattedAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('upi_id');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('inputting');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentApps, setPaymentApps] = useState<PaymentApp[]>([
    { 
      name: 'Google Pay', 
      packageName: 'com.google.android.apps.nbu.paisa.user', 
      uriScheme: 'gpay://', 
      icon: 'google', 
      color: '#4285F4',
      installed: false 
    },
    { 
      name: 'PhonePe', 
      packageName: 'com.phonepe.app', 
      uriScheme: 'phonepe://', 
      icon: 'phone', 
      color: '#5f259f',
      installed: false 
    },
    { 
      name: 'Paytm', 
      packageName: 'net.one97.paytm', 
      uriScheme: 'paytmmp://', 
      icon: 'wallet', 
      color: '#00BAF2',
      installed: false 
    },
    { 
      name: 'BHIM', 
      packageName: 'in.org.npci.upiapp', 
      uriScheme: 'bhim://', 
      icon: 'currency-inr', 
      color: '#00718F',
      installed: false 
    },
  ]);
  
  // QR code data - in a real app, this would be generated from a backend
  const qrData = `upi://pay?pa=truecredit@ybl&pn=TrueCredit&am=${amount}&tn=Loan Payment&cu=INR`;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const animationProgress = useRef(new Animated.Value(0)).current;

  // Animation for card rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Validate UPI ID format
  const validateUpiId = (upiId: string) => {
    // Basic UPI ID validation: username@handle format
    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiPattern.test(upiId);
  };

  // Toggle between UPI ID and QR code payment methods
  const togglePaymentMode = () => {
    setPaymentMode(prev => prev === 'upi_id' ? 'qr_code' : 'upi_id');
    setErrorMessage('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Format amount with commas and rupee symbol
  useEffect(() => {
    if (amount) {
      const numAmount = parseFloat(amount.replace(/,/g, ''));
      if (!isNaN(numAmount)) {
        setFormattedAmount(
          '₹ ' + numAmount.toLocaleString('en-IN')
        );
      } else {
        setFormattedAmount('₹ 0');
      }
    } else {
      setFormattedAmount('₹ 0');
    }
  }, [amount]);

  // Check which payment apps are installed on the device
  const checkInstalledApps = async () => {
    const updatedApps = [...paymentApps];
    
    // In developer mode, show all apps as installed
    if (DEVELOPER_MODE) {
      console.log('DEVELOPER MODE: Showing all payment apps');
      const allApps = paymentApps.map(app => ({ ...app, installed: true }));
      setPaymentApps(allApps);
      return;
    }
    
    try {
      // For mobile platforms, check each app
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        // More accurate detection on Android
        if (Platform.OS === 'android') {
          // Using specific package checks for Android
          for (let i = 0; i < updatedApps.length; i++) {
            try {
              const app = updatedApps[i];
              // On Android, we check if the package can be opened directly
              const canOpen = await Linking.canOpenURL(`${app.packageName}://pay`);
              console.log(`${app.name} installed: ${canOpen}`);
              updatedApps[i].installed = canOpen;
            } catch (error) {
              console.error(`Error checking ${updatedApps[i].name}:`, error);
              updatedApps[i].installed = false;
            }
          }
        } else {
          // iOS checks using URI schemes
          for (let i = 0; i < updatedApps.length; i++) {
            try {
              const app = updatedApps[i];
              const canOpen = await Linking.canOpenURL(app.uriScheme);
              console.log(`${app.name} installed: ${canOpen}`);
              updatedApps[i].installed = canOpen;
            } catch (error) {
              console.error(`Error checking ${updatedApps[i].name}:`, error);
              updatedApps[i].installed = false;
            }
          }
        }
        
        // If no apps were detected and we're on a real device, show all as fallback
        if (!updatedApps.some(app => app.installed)) {
          console.log('No apps detected on real device, showing all as fallback');
          updatedApps.forEach(app => app.installed = true);
        }
      } else {
        // On web or other platforms, don't show any apps
        updatedApps.forEach(app => app.installed = false);
      }
      
      // Update the state with the results
      setPaymentApps(updatedApps);
    } catch (error) {
      console.error('Error in checkInstalledApps:', error);
      // On error, show all apps as fallback
      const allApps = paymentApps.map(app => ({ ...app, installed: true }));
      setPaymentApps(allApps);
    }
  };

  // Open a specific payment app with UPI parameters
  const openPaymentApp = (app: PaymentApp) => {
    try {
      let upiLink = '';
      
      // Different handling for each app
      if (Platform.OS === 'android') {
        // On Android, we use the standard UPI intent
        // Each app will pick this up if it's registered for UPI
        upiLink = `upi://pay?pa=truecredit@ybl&pn=TrueCredit&am=${amount}&tn=Loan%20Payment&cu=INR`;
      } else {
        // On iOS, use the app-specific URI scheme
        // Each app has its own format
        switch (app.name) {
          case 'Google Pay':
            upiLink = `${app.uriScheme}upi://pay?pa=truecredit@ybl&pn=TrueCredit&am=${amount}&tn=Loan%20Payment&cu=INR`;
            break;
          case 'PhonePe':
            upiLink = `${app.uriScheme}pay?pa=truecredit@ybl&pn=TrueCredit&am=${amount}&tn=Loan%20Payment&cu=INR`;
            break;
          case 'Paytm':
            upiLink = `${app.uriScheme}pay?pa=truecredit@ybl&pn=TrueCredit&am=${amount}&tn=Loan%20Payment&cu=INR`;
            break;
          case 'BHIM':
            upiLink = `${app.uriScheme}pay?pa=truecredit@ybl&pn=TrueCredit&am=${amount}&tn=Loan%20Payment&cu=INR`;
            break;
          default:
            upiLink = `${app.uriScheme}?pa=truecredit@ybl&pn=TrueCredit&am=${amount}&tn=Loan%20Payment&cu=INR`;
        }
      }
      
      console.log(`Opening payment app with link: ${upiLink}`);
      
      // In developer mode, show alert instead of opening the app
      if (DEVELOPER_MODE) {
        alert(`[DEVELOPER MODE] Would open: ${app.name}\n\nURL: ${upiLink}`);
        return;
      }
      
      // Use Linking to open the app
      Linking.openURL(upiLink).catch(err => {
        console.error(`Error opening link: ${upiLink}`, err);
        alert(`Error opening ${app.name}: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error preparing to open ${app.name}:`, err);
      setErrorMessage(`Couldn't open ${app.name}`);
    }
  };

  // Animate in the component and check installed apps
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Check which payment apps are installed
    checkInstalledApps();
  }, []);

  // Handle payment submission
  const handlePayment = () => {
    // Validate based on payment mode
    if (paymentMode === 'upi_id') {
      // Check if UPI ID is provided and valid
      if (!upiId) {
        setErrorMessage('Please enter your UPI ID');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      
      if (!validateUpiId(upiId)) {
        setErrorMessage('Please enter a valid UPI ID (e.g. username@upi)');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
    }
    
    // Check if amount is valid
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Clear error if validation passes
    setErrorMessage('');
    
    // Start processing animation
    setPaymentStatus('processing');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Simulate API call with spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    // Simulate payment processing (success or failure)
    setTimeout(() => {
      // For demo purposes, we'll randomly decide if payment succeeded or failed
      // In a real app, this would be determined by the API response
      const randomSuccess = Math.random() > 0.3; // 70% chance of success
      
      if (randomSuccess) {
        setPaymentStatus('success');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Animate the success screen after a delay
        Animated.timing(animationProgress, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }).start();
        
        // Navigate back to loans screen after showing success for a moment
        setTimeout(() => {
          router.replace('/loans/my-loans');
        }, 3000);
      } else {
        setPaymentStatus('failure');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }, 3000);
  };

  // Handle retry after payment failure
  const handleRetry = () => {
    setPaymentStatus('inputting');
    setErrorMessage('');
  };

  // Render payment form
  const renderPaymentForm = () => (
    <ScrollView 
      style={styles.formContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={[
          styles.amountContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <Text style={styles.amountLabel}>Payment Amount</Text>
        
        {/* Editable amount */}
        <View style={styles.editableAmountContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={(text) => {
              // Only allow numbers
              const cleanedText = text.replace(/[^0-9]/g, '');
              setAmount(cleanedText);
            }}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
        
        <Text style={styles.dueDate}>Due on {dueDate}</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.paymentMethodContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <View style={styles.paymentHeader}>
          <Text style={styles.paymentTitle}>Payment Method</Text>
        </View>

        {/* Payment Mode Toggle */}
        <View style={styles.paymentToggleContainer}>
          <TouchableOpacity 
            style={[styles.paymentToggleButton, paymentMode === 'upi_id' && styles.paymentToggleButtonActive]}
            onPress={() => setPaymentMode('upi_id')}
          >
            <MaterialCommunityIcons name="cellphone" size={20} color={paymentMode === 'upi_id' ? '#003DF5' : '#757575'} />
            <Text style={[styles.paymentToggleText, paymentMode === 'upi_id' && styles.paymentToggleTextActive]}>UPI ID</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentToggleButton, paymentMode === 'qr_code' && styles.paymentToggleButtonActive]}
            onPress={() => setPaymentMode('qr_code')}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={20} color={paymentMode === 'qr_code' ? '#003DF5' : '#757575'} />
            <Text style={[styles.paymentToggleText, paymentMode === 'qr_code' && styles.paymentToggleTextActive]}>QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* UPI ID Input */}
        {paymentMode === 'upi_id' && (
          <View style={styles.upiContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Enter UPI ID</Text>
              <TextInput
                style={styles.input}
                placeholder="username@upi"
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Text style={styles.upiHint}>Example: yourname@okaxis, 9876543210@ybl</Text>
            </View>

            {/* Payment instructions */}
            <View style={styles.upiInstructionsContainer}>
              <MaterialCommunityIcons name="information-outline" size={24} color="#003DF5" style={styles.infoIcon} />
              <Text style={styles.upiInstructions}>
                Please enter your UPI ID to make a payment. The amount will be deducted from your linked account.
              </Text>
            </View>
          </View>
        )}

        {/* QR Code */}
        {paymentMode === 'qr_code' && (
          <View style={styles.qrContainer}>
            <View style={styles.qrCode}>
              {/* Using View with border as placeholder, in a real app use a QR code generator */}
              <View style={styles.qrImage}>
                <MaterialCommunityIcons name="qrcode" size={150} color="#333" />
              </View>
            </View>
            <Text style={styles.qrInstructions}>Scan this QR code with any UPI app to pay</Text>
            <View style={styles.qrDataContainer}>
              <Text style={styles.qrDataLabel}>UPI ID:</Text>
              <Text style={styles.qrDataValue}>truecredit@ybl</Text>
            </View>
          </View>
        )}

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handlePayment}
            style={styles.primaryButtonWrapper}
          >
            <LinearGradient
              colors={['#003DF5', '#5A96FE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.payButton}
            >
              <Text style={styles.payButtonText}>
                {paymentMode === 'upi_id' ? 'Pay Now' : 'I\'ve Scanned the QR'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButtonWrapper}
            onPress={() => router.back()}
          >
            <View style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color="#003DF5" style={{marginRight: 5}} />
              <Text style={styles.backButtonText}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );

  // Render processing state
  const renderProcessing = () => (
    <View style={styles.statusContainer}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <View style={styles.processingIconContainer}>
          <MaterialIcons name="sync" size={60} color="#003DF5" />
        </View>
      </Animated.View>
      <Text style={styles.processingText}>Processing Payment</Text>
      <Text style={styles.processingSubtext}>Please wait while we process your payment...</Text>
    </View>
  );

  // Render success state
  const renderSuccess = () => (
    <View style={styles.statusContainer}>
      <View style={styles.successIconContainer}>
        {/* Replace with LottieView animation when you have the JSON file */}
        <Animated.View 
          style={[
            styles.checkmarkCircle,
            { transform: [{ scale: animationProgress }] }
          ]}
        >
          <MaterialIcons name="check" size={60} color="#fff" />
        </Animated.View>
      </View>
      <Text style={styles.successText}>Payment Successful!</Text>
      <Text style={styles.successAmount}>{formattedAmount}</Text>
      <Text style={styles.successSubtext}>Your payment has been processed successfully.</Text>
      <Text style={styles.successId}>Transaction ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</Text>
    </View>
  );

  // Render failure state
  const renderFailure = () => (
    <View style={styles.statusContainer}>
      <View style={styles.failureIconContainer}>
        <MaterialIcons name="error-outline" size={60} color="#fff" />
      </View>
      <Text style={styles.failureText}>Payment Failed</Text>
      <Text style={styles.failureSubtext}>Your payment could not be processed. Please try again.</Text>
      <TouchableOpacity
        onPress={handleRetry}
        style={{ marginTop: 30 }}
      >
        <LinearGradient
          colors={['#003DF5', '#5A96FE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen
        options={{
          title: loanTitle,
          headerStyle: {
            backgroundColor: '#003DF5',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerBackButton}
              disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <LinearGradient
        colors={['#003DF5', '#5A96FE']}
        style={styles.header}
      />
      
      <View style={styles.content}>
        {paymentStatus === 'inputting' && renderPaymentForm()}
        {paymentStatus === 'processing' && renderProcessing()}
        {paymentStatus === 'success' && renderSuccess()}
        {paymentStatus === 'failure' && renderFailure()}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 120,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
  headerBackButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    paddingBottom: 30,
  },
  amountContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  editableAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  currencySymbol: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#003DF5',
    marginRight: 5,
  },
  amountInput: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#003DF5',
    minWidth: 100,
    textAlign: 'center',
    padding: 0,
  },
  dueDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },
  paymentMethodContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  paymentToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
    padding: 4,
  },
  paymentToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  paymentToggleButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentToggleText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
    fontWeight: '500',
  },
  paymentToggleTextActive: {
    color: '#003DF5',
    fontWeight: '600',
  },
  upiContainer: {
    marginBottom: 20,
  },
  upiHint: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  upiInstructionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f7ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  upiInstructions: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrCode: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  qrImage: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInstructions: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  qrDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  qrDataLabel: {
    fontSize: 14,
    color: '#555',
    marginRight: 5,
  },
  qrDataValue: {
    fontSize: 14,
    color: '#003DF5',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
  primaryButtonWrapper: {
    width: '100%',
  },
  payButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#003DF5',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#e53935',
    marginTop: 10,
    fontSize: 14,
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  processingIconContainer: {
    marginBottom: 20,
  },
  processingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  processingSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  successAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  successSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  successId: {
    fontSize: 14,
    color: '#999',
    marginTop: 15,
  },
  failureIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  failureText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  failureSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
