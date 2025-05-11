import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeLoan() {
  const [loanAmount, setLoanAmount] = useState('100000');
  const [tenure, setTenure] = useState('12');
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Convert numeric input to formatted currency
  const formatCurrency = (value: string) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    return numericValue;
  };

  // Format for display
  const formatForDisplay = (value: string) => {
    const numericValue = parseInt(value.replace(/\D/g, ''));
    return numericValue ? numericValue.toLocaleString('en-IN') : '0';
  };

  // Handle loan amount input change
  const handleLoanAmountChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    setLoanAmount(formattedValue);
    validateForm(formattedValue, tenure);
  };

  // Add 50K to the current loan amount
  const add50K = () => {
    const currentAmount = parseInt(loanAmount) || 0;
    const newAmount = Math.min(currentAmount + 50000, 5000000); // Cap at 50L
    setLoanAmount(newAmount.toString());
    validateForm(newAmount.toString(), tenure);
  };
  
  // Add 1L to the current loan amount
  const add1L = () => {
    const currentAmount = parseInt(loanAmount) || 0;
    const newAmount = Math.min(currentAmount + 100000, 5000000); // Cap at 50L
    setLoanAmount(newAmount.toString());
    validateForm(newAmount.toString(), tenure);
  };

  // Handle tenure change
  const handleTenureChange = (value: string) => {
    // Only allow digits and limit to 2 digits
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 2) {
      setTenure(numericValue);
      validateForm(loanAmount, numericValue);
    }
  };

  // Validate the form
  const validateForm = (amount: string, tenureMonths: string) => {
    const amountValid = parseInt(amount) >= 100000 && parseInt(amount) <= 10000000;
    const tenureValid = parseInt(tenureMonths) >= 12 && parseInt(tenureMonths) <= 360;
    setIsFormValid(amountValid && tenureValid);
  };

  // Handle the Next button press
  const handleNext = () => {
    if (isFormValid) {
      router.push({
        pathname: '/loans/upload-pan',
        params: { amount: loanAmount, tenure: tenure, type: 'home' }
      });
    }
  };

  return (
    <LinearGradient
      colors={['#f0f8ff', '#e6f2ff', '#d9ecff']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.title}>Home Loan</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Let's get you a home loan</Text>
          <Text style={styles.subtitle}>Tell us about your requirements</Text>

          {/* Loan Amount Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Loan Amount (₹)</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={formatForDisplay(loanAmount)}
                onChangeText={handleLoanAmountChange}
                keyboardType="numeric"
                placeholder="Enter loan amount"
                maxLength={10}
              />
            </View>
            
            <View style={styles.quickAddContainer}>
              <TouchableOpacity style={styles.quickAddButton} onPress={add50K}>
                <Text style={styles.quickAddButtonText}>+ ₹50K</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAddButton} onPress={add1L}>
                <Text style={styles.quickAddButtonText}>+ ₹1L</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.amountRangeInfo}>
              <Text style={styles.amountRangeText}>Amount Range: ₹1,00,000 - ₹1,00,00,000</Text>
            </View>
          </View>

          {/* Tenure Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Loan Tenure (Months)</Text>
            <View style={styles.tenureInputContainer}>
              <TextInput
                style={styles.tenureInput}
                value={tenure}
                onChangeText={handleTenureChange}
                keyboardType="numeric"
                placeholder="Months"
                maxLength={3}
              />
              <Text style={styles.tenureUnit}>Months</Text>
            </View>

            <View style={styles.tenureOptions}>
              {[12, 60, 120, 180, 240, 360].map((month) => (
                <TouchableOpacity 
                  key={month} 
                  style={[styles.tenureOption, parseInt(tenure) === month && styles.selectedTenure]}
                  onPress={() => {
                    setTenure(String(month));
                    validateForm(loanAmount, String(month));
                  }}
                >
                  <Text style={[styles.tenureOptionText, parseInt(tenure) === month && styles.selectedTenureText]}>{month}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Spacer */}
          <View style={{ height: 20 }} />

          {/* Button to proceed */}
          <TouchableOpacity
            style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!isFormValid}
          >
            <LinearGradient
              colors={isFormValid ? ['#1976D2', '#2196F3', '#1976D2'] : ['#CCCCCC', '#DDDDDD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
    color: '#1565C0',
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
  },
  inputSection: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F8FAFF',
  },
  currencySymbol: {
    fontSize: 20,
    color: '#1976D2',
    fontWeight: 'bold',
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    paddingVertical: 12,
    color: '#333',
  },
  quickAddContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 8,
    gap: 10,
  },
  quickAddButton: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAddButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  amountRangeInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  amountRangeText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  tenureInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F8FAFF',
  },
  tenureInput: {
    flex: 1,
    fontSize: 20,
    paddingVertical: 12,
    color: '#333',
  },
  tenureUnit: {
    fontSize: 16,
    color: '#666',
  },
  tenureOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  tenureOption: {
    width: (width - 80) / 3 - 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  selectedTenure: {
    borderColor: '#1976D2',
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
  tenureOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTenureText: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
});
