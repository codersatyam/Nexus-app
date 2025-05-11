import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function EMICalculator() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(1000);
  const [tenure, setTenure] = useState(1);
  const [ROI, setROI] = useState(1);
  const FIXED_INTEREST_RATE = 25; // Fixed at 25%
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // Calculate EMI whenever amount or tenure changes
  const calculateEMI = useCallback(() => {
    const principal = loanAmount;
    const ratePerMonth = ROI / (12 * 100);
    const tenureMonths = tenure;

    const emiAmount = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenureMonths)) /
      (Math.pow(1 + ratePerMonth, tenureMonths) - 1);
    const totalAmount = emiAmount * tenureMonths;
    const interestAmount = totalAmount - principal;

    setEmi(emiAmount);
    setTotalInterest(interestAmount);
    setTotalPayment(totalAmount);
  }, [loanAmount, tenure]);

  // Update calculations when values change
  const handleAmountChange = (value: number) => {
    setLoanAmount(Math.round(value));
    calculateEMI();
  };

  const handleTenureChange = (value: number) => {
    setTenure(Math.round(value));
    calculateEMI();
  };
  const handleROIChange = (value: number) => {
    setROI(Math.round(value));
    calculateEMI();
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EMI Calculator</Text>
      </View>

      <View style={styles.resultCard}>
        <View style={styles.emiCircle}>
          <View style={styles.emiCircleInner}>
            <Text style={styles.emiLabel}>Your EMI is</Text>
            <Text style={styles.emiAmount}>₹{Math.round(emi).toLocaleString()}</Text>
            <Text style={styles.emiPeriod}>per month</Text>
          </View>
        </View>

        <View style={styles.breakdownContainer}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Principal</Text>
              <Text style={styles.breakdownAmount}>₹{loanAmount.toLocaleString()}</Text>
              <View style={[styles.progressBar, styles.principalBar]} />
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Interest</Text>
              <Text style={styles.breakdownAmount}>₹{Math.round(totalInterest).toLocaleString()}</Text>
              <View style={[styles.progressBar, styles.interestBar]} />
            </View>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalAmount}>₹{Math.round(totalPayment).toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.inputsContainer}>
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Loan Amount</Text>
            <Text style={styles.valueText}>₹{loanAmount.toLocaleString()}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1000000}
            value={loanAmount}
            onValueChange={handleAmountChange}
            step={1000}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#007AFF"
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeText}>₹1000</Text>
            <Text style={styles.rangeText}>₹10,00,000</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Loan Tenure</Text>
            <Text style={styles.valueText}>{tenure} months</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={24}
            value={tenure}
            onValueChange={handleTenureChange}
            step={1}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#007AFF"
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeText}>1 months</Text>
            <Text style={styles.rangeText}>24 months</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>ROI</Text>
            <Text style={styles.valueText}>{ROI} %</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={30}
            value={tenure}
            onValueChange={handleROIChange}
            step={1}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#007AFF"
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeText}>1 %</Text>
            <Text style={styles.rangeText}>30 %</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => router.push("/loans/apply")}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'left',
    marginRight: 40,
  },
  resultCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emiCircle: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
  },
  emiCircleInner: {
    backgroundColor: '#f8f9ff',
    borderRadius: 100,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  emiLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emiAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emiPeriod: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  breakdownContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  breakdownItem: {
    flex: 1,
    paddingHorizontal: 10,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  breakdownAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  principalBar: {
    backgroundColor: '#007AFF',
    width: '70%',
  },
  interestBar: {
    backgroundColor: '#34C759',
    width: '30%',
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  inputsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    color: '#333',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 4,
  },
  percentSymbol: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  rangeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  }
});
