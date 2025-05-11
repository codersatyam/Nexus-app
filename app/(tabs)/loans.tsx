import { StyleSheet, View, TouchableOpacity, Text, ImageBackground, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LoanCard } from "../../src/components/loans/LoanCard";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Define loan type for TypeScript
type Loan = {
  title: string;
  amount: number;
  interest: number;
  duration: string;
  nextPayment: string;
  amountDue: number;
};

type LoanType = Loan | null;

export default function LoansScreen() {
  const router = useRouter();

  // Sample loan data - set to null to show no active loans
  const currentLoan: LoanType = null; 
  
  // Uncomment to show an active loan
  // const currentLoan: LoanType = {
  //   title: 'Personal Loan',
  //   amount: 25000,
  //   interest: 8.5,
  //   duration: '24 months',
  //   nextPayment: '18 May, 2025',
  //   amountDue: 2850
  // };

  return (
    <LinearGradient
      colors={['#f0f8ff', '#e6f2ff', '#d9ecff']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loans</Text>
        {/* <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#1976D2" />
        </TouchableOpacity> */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Loan Application Card */}
          <LinearGradient
            colors={['#1976D2', '#2196F3', '#1976D2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.applyLoanCard}
          >
            <View style={styles.applyLoanContent}>
              <Text style={styles.applyLoanTitle}>Need a loan?</Text>
              <Text style={styles.applyLoanDescription}>We offer competitive rates and flexible repayment options</Text>
              
              <TouchableOpacity 
                style={styles.applyNowButton}
                onPress={() => router.push("/loans/loan-types")}
              >
                <Text style={styles.applyNowButtonText}>Apply Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#1976D2" />
              </TouchableOpacity>
            </View>
            <View style={styles.applyLoanIconContainer}>
              <FontAwesome5 name="hand-holding-usd" size={40} color="rgba(255,255,255,0.9)" />
            </View>
          </LinearGradient>

          {/* Current Loan Card (if exists) */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Current Loan</Text>
              {currentLoan && (
                <TouchableOpacity onPress={() => router.push("/loans/my-loans")}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              )}
            </View>

            {currentLoan ? (
              <View style={styles.currentLoanCard}>
                {/* TypeScript needs this cast since it doesn't recognize the nullability check properly */}
                {(() => {
                  // This helps TypeScript understand that currentLoan is not null in this block
                  const loan = currentLoan as Loan;
                  return (
                    <>
                      <View style={styles.loanHeader}>
                        <View style={styles.loanTypeContainer}>
                          <View style={styles.loanTypeIcon}>
                            <Ionicons name="person-outline" size={18} color="#fff" />
                          </View>
                          <Text style={styles.loanType}>{loan.title}</Text>
                        </View>
                        <View style={styles.statusContainer}>
                          <View style={styles.statusIndicator} />
                          <Text style={styles.statusText}>Active</Text>
                        </View>
                      </View>

                      <View style={styles.loanDetails}>
                        <View style={styles.amountContainer}>
                          <Text style={styles.amountLabel}>Loan Amount</Text>
                          <Text style={styles.amountValue}>₹{loan.amount.toLocaleString('en-IN')}</Text>
                        </View>
                        <View style={styles.detailsRow}>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Interest Rate</Text>
                            <Text style={styles.detailValue}>{loan.interest}%</Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Duration</Text>
                            <Text style={styles.detailValue}>{loan.duration}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.paymentSection}>
                        <View style={styles.nextPaymentContainer}>
                          <Text style={styles.nextPaymentLabel}>Next Payment</Text>
                          <Text style={styles.nextPaymentDate}>{loan.nextPayment}</Text>
                          <Text style={styles.nextPaymentAmount}>₹{loan.amountDue}</Text>
                        </View>
                        <TouchableOpacity style={styles.payNowButton}>
                          <Text style={styles.payNowButtonText}>Pay Now</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  );
                })()} 
              </View>
            ) : (
              <View style={styles.noLoanCard}>
                <View style={styles.noLoanIconContainer}>
                  <MaterialIcons name="money-off" size={40} color="#bdbdbd" />
                </View>
                <Text style={styles.noLoanTitle}>No Active Loans</Text>
                <Text style={styles.noLoanDescription}>You don't have any active loans at the moment. Apply for a loan to get started.</Text>
                <TouchableOpacity 
                  style={styles.applyButtonInCard}
                  onPress={() => router.push("/loans/loan-types")}
                >
                  <LinearGradient
                    colors={['#1976D2', '#2196F3']}
                    style={styles.applyButtonGradient}
                  >
                    <Text style={styles.applyButtonText}>Apply for a Loan</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Loan Options */}
          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.optionsGrid}>
              {/* <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => router.push("/loans/loan-types")}
              >
                <View style={[styles.optionIconContainer, { backgroundColor: '#e3f2fd' }]}>
                  <MaterialIcons name="compare-arrows" size={22} color="#1976D2" />
                </View>
                <Text style={styles.optionText}>Apply Loans</Text>
              </TouchableOpacity> */}
              
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => router.push("/loans/my-loans")}
              >
                <View style={[styles.optionIconContainer, { backgroundColor: '#e8f5e9' }]}>
                  <MaterialIcons name="assignment" size={22} color="#43a047" />
                </View>
                <Text style={styles.optionText}>My Loans</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionButton}>
                <View style={[styles.optionIconContainer, { backgroundColor: '#fff8e1' }]}>
                  <MaterialIcons name="calculate" size={22} color="#ffb300" />
                </View>
                <Text style={styles.optionText}>EMI Calculator</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionButton}>
                <View style={[styles.optionIconContainer, { backgroundColor: '#f3e5f5' }]}>
                  <MaterialIcons name="support-agent" size={22} color="#8e24aa" />
                </View>
                <Text style={styles.optionText}>Support</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  profileButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },
  applyLoanCard: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  applyLoanContent: {
    flex: 3,
  },
  applyLoanIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyLoanTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  applyLoanDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  applyNowButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applyNowButtonText: {
    color: '#1976D2',
    fontWeight: '600',
    fontSize: 14,
  },
  currentLoanCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loanTypeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4264ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loanType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  loanDetails: {
    marginBottom: 16,
  },
  amountContainer: {
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  nextPaymentContainer: {
    flex: 1,
  },
  nextPaymentLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  nextPaymentDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  nextPaymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  payNowButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  payNowButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  optionsContainer: {
    marginTop: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  optionButton: {
    width: (width - 50) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  noLoanCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noLoanIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  noLoanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 8,
  },
  noLoanDescription: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  applyButtonInCard: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  },
  applyButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  }
}); 