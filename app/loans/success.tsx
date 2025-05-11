import { StyleSheet, View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoanSuccess() {
  const { amount, tenure, type } = useLocalSearchParams<{ amount: string, tenure: string, type: string }>();
  
  // Get proper loan type name
  const getLoanTypeName = () => {
    switch(type) {
      case 'personal': return 'Personal Loan';
      case 'business': return 'Business Loan';
      case 'home': return 'Home Loan';
      case 'gold': return 'Gold Loan';
      case 'vehicle': return 'Vehicle Loan';
      default: return 'Loan';
    }
  };
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animation sequence
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Format the amount
  const formattedAmount = parseInt(amount || '0').toLocaleString('en-IN');
  
  // Get loan application number - would come from API in real app
  const applicationNumber = `LN${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  // Calculate expected disbursal date (3 days from now)
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const disbursalDate = date.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Go to home
  const goToHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#1976D2', '#2196F3', '#64B5F6']}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.contentContainer,
          { 
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }] 
          }
        ]}
      >
        <Animated.View style={[styles.successIconContainer, {
          transform: [
            { scale: scaleAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.5, 1.2, 1]
            }) }
          ]
        }]}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={55} color="white" />
          </View>
        </Animated.View>
        
        <Text style={styles.congratsText}>Congratulations!</Text>
        <Text style={styles.successTitle}>Loan Application Submitted</Text>
        <Text style={styles.successMessage}>
          Your {getLoanTypeName()} application for ₹{formattedAmount} has been successfully submitted.
          Our team will review your application and get back to you shortly.
        </Text>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Application Number</Text>
            <Text style={styles.detailValue}>{applicationNumber}</Text>
          </View>
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Loan Amount</Text>
            <Text style={styles.detailValue}>₹{formattedAmount}</Text>
          </View>
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Loan Type</Text>
            <Text style={styles.detailValue}>{getLoanTypeName()}</Text>
          </View>
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tenure</Text>
            <Text style={styles.detailValue}>{tenure} Months</Text>
          </View>
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expected Disbursal</Text>
            <Text style={styles.detailValue}>{disbursalDate}</Text>
          </View>
        </View>
        
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle" size={20} color="#1976D2" />
          <Text style={styles.noteText}>
            You will receive updates about your application status via SMS and email.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.homeButton} onPress={goToHome}>
          <LinearGradient
            colors={['#1565C0', '#1976D2']}
            style={styles.homeButtonGradient}
          >
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>
            Need help? Contact our support team at
          </Text>
          <TouchableOpacity>
            <Text style={styles.supportLink}>support@truecredit.com</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    maxWidth: 500,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: '#F5F9FF',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },
  homeButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  homeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  supportContainer: {
    alignItems: 'center',
  },
  supportText: {
    fontSize: 12,
    color: '#666',
  },
  supportLink: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});
