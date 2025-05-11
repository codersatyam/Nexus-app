import { StyleSheet, View, Text, ScrollView, Dimensions, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

// Define types for loan data
type LoanStatus = 'active' | 'completed' | 'pending' | 'rejected';

type Loan = {
  id: string;
  title: string;
  amount: number;
  interest: number;
  duration: string;
  status: LoanStatus;
  type: string;
  appliedDate: string;
  nextPayment?: string;
  amountDue?: number;
  progress?: number;
};

export default function MyLoans() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<LoanStatus | null>(null);
  
  // Sample loan data
  const loans: Loan[] = [
    {
      id: '1',
      title: 'Personal Loan',
      amount: 25000,
      interest: 8.5,
      duration: '24 months',
      status: 'active',
      type: 'personal',
      appliedDate: '10 Jan, 2025',
      nextPayment: '18 May, 2025',
      amountDue: 2850,
      progress: 25
    },
    {
      id: '2',
      title: 'Business Loan',
      amount: 150000,
      interest: 11.5,
      duration: '36 months',
      status: 'active',
      type: 'business',
      appliedDate: '15 Feb, 2025',
      nextPayment: '15 May, 2025',
      amountDue: 8500,
      progress: 10
    },
    {
      id: '3',
      title: 'Home Loan',
      amount: 3500000,
      interest: 7.5,
      duration: '15 years',
      status: 'pending',
      type: 'home',
      appliedDate: '02 Apr, 2025',
    },
    {
      id: '4',
      title: 'Gold Loan',
      amount: 80000,
      interest: 7.5,
      duration: '12 months',
      status: 'completed',
      type: 'gold',
      appliedDate: '05 Sep, 2024',
      progress: 100
    },
    {
      id: '5',
      title: 'Personal Loan',
      amount: 15000,
      interest: 9.0,
      duration: '12 months',
      status: 'rejected',
      type: 'personal',
      appliedDate: '20 Mar, 2025',
    },
  ];

  // Get unique loan types for filter
  const loanTypes = [...new Set(loans.map(loan => loan.type))];

  // Filter loans based on selected type and status
  const filteredLoans = loans.filter(loan => {
    if (selectedType && loan.type !== selectedType) return false;
    if (selectedStatus && loan.status !== selectedStatus) return false;
    return true;
  });

  // Get a color for the loan status
  const getStatusColor = (status: LoanStatus) => {
    switch(status) {
      case 'active': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'completed': return '#2196F3';
      case 'rejected': return '#F44336';
      default: return '#757575';
    }
  };

  // Get an icon for the loan type
  const getLoanTypeIcon = (type: string) => {
    switch(type) {
      case 'personal': return 'person-outline';
      case 'business': return 'business-outline';
      case 'home': return 'home-outline';
      case 'gold': return 'diamond-outline';
      case 'vehicle': return 'car-outline';
      default: return 'cash-outline';
    }
  };

  // Get a color for the loan type
  const getLoanTypeColor = (type: string) => {
    switch(type) {
      case 'personal': return '#4264ED';
      case 'business': return '#34C759';
      case 'home': return '#FF9500';
      case 'gold': return '#FFD700';
      case 'vehicle': return '#FF3B30';
      default: return '#757575';
    }
  };

  // Format a status name to be more readable
  const formatStatus = (status: LoanStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedType(null);
    setSelectedStatus(null);
  };

  // Render a loan card
  const renderLoanCard = ({ item }: { item: Loan }) => {
    return (
      <View style={styles.loanCard}>
        <View style={styles.loanHeader}>
          <View style={styles.loanTypeContainer}>
            <View style={[styles.loanTypeIcon, { backgroundColor: getLoanTypeColor(item.type) }]}>
              <Ionicons name={getLoanTypeIcon(item.type) as any} size={18} color="#fff" />
            </View>
            <Text style={styles.loanType}>{item.title}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {formatStatus(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.loanDetails}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Loan Amount</Text>
            <Text style={styles.amountValue}>₹{item.amount.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Interest Rate</Text>
              <Text style={styles.detailValue}>{item.interest}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{item.duration}</Text>
            </View>
          </View>
        </View>

        {item.status === 'active' && item.progress !== undefined && (
          <View style={styles.paymentSection}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  // Use a numeric value for width percentage
                  { width: `${Math.min(item.progress, 100)}%` as any }
                ]} 
              />
            </View>
            <View style={styles.progressDetails}>
              <Text style={styles.progressText}>{item.progress}% Completed</Text>
              <Text style={styles.appliedDate}>Applied on {item.appliedDate}</Text>
            </View>
          </View>
        )}

        {item.status === 'active' && item.amountDue !== undefined && item.nextPayment && (
          <View style={styles.actionSection}>
            <View style={styles.nextPaymentContainer}>
              <Text style={styles.nextPaymentLabel}>Next Payment</Text>
              <Text style={styles.nextPaymentDate}>{item.nextPayment}</Text>
              <Text style={styles.nextPaymentAmount}>₹{item.amountDue ? item.amountDue.toLocaleString('en-IN') : '0'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.payNowButton}
              onPress={() => router.push({
                pathname: '/loans/payment',
                params: {
                  loanId: item.id,
                  loanTitle: item.title,
                  amountDue: item.amountDue ? item.amountDue.toString() : '0',
                  dueDate: item.nextPayment
                }
              })}
            >
              <Text style={styles.payNowButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'pending' && (
          <View style={styles.statusMessage}>
            <MaterialIcons name="hourglass-top" size={18} color="#FFC107" />
            <Text style={styles.pendingText}>Your application is under review</Text>
          </View>
        )}

        {item.status === 'rejected' && (
          <View style={styles.statusMessage}>
            <MaterialIcons name="cancel" size={18} color="#F44336" />
            <Text style={styles.rejectedText}>Application rejected. Contact support for details.</Text>
          </View>
        )}

        {item.status === 'completed' && (
          <View style={styles.statusMessage}>
            <MaterialIcons name="check-circle-outline" size={18} color="#4CAF50" />
            <Text style={styles.completedText}>Loan fully repaid. Thank you!</Text>
          </View>
        )}

        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <MaterialIcons name="chevron-right" size={18} color="#1976D2" />
        </TouchableOpacity>
      </View>
    );
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
        <Text style={styles.headerTitle}>My Loans</Text>
      </View>
      
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Filter by:</Text>
        
        <View style={styles.filterChipsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
            {/* Type filters */}
            {loanTypes.map((type) => (
              <TouchableOpacity 
                key={`type-${type}`}
                style={[
                  styles.filterChip,
                  selectedType === type && { backgroundColor: getLoanTypeColor(type) + '20', borderColor: getLoanTypeColor(type) }
                ]}
                onPress={() => setSelectedType(selectedType === type ? null : type)}
              >
                <Ionicons 
                  name={getLoanTypeIcon(type) as any} 
                  size={16} 
                  color={selectedType === type ? getLoanTypeColor(type) : '#757575'} 
                />
                <Text 
                  style={[
                    styles.filterChipText,
                    selectedType === type && { color: getLoanTypeColor(type) }
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* Status filters */}
            {(['active', 'pending', 'completed', 'rejected'] as LoanStatus[]).map((status) => (
              <TouchableOpacity 
                key={`status-${status}`}
                style={[
                  styles.filterChip,
                  selectedStatus === status && { backgroundColor: getStatusColor(status) + '20', borderColor: getStatusColor(status) }
                ]}
                onPress={() => setSelectedStatus(selectedStatus === status ? null : status)}
              >
                <View style={[styles.microIndicator, { backgroundColor: getStatusColor(status) }]} />
                <Text 
                  style={[
                    styles.filterChipText,
                    selectedStatus === status && { color: getStatusColor(status) }
                  ]}
                >
                  {formatStatus(status)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {(selectedType || selectedStatus) && (
            <TouchableOpacity style={styles.clearFilterButton} onPress={clearFilters}>
              <MaterialIcons name="cancel" size={16} color="#F44336" />
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {filteredLoans.length > 0 ? (
        <FlatList
          data={filteredLoans}
          renderItem={renderLoanCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.loansList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIconContainer}>
            <MaterialIcons name="assignment" size={50} color="#bdbdbd" />
          </View>
          <Text style={styles.emptyStateTitle}>No Loans Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            {selectedType || selectedStatus ? 
              "No loans match your filter criteria. Try clearing filters." : 
              "You don't have any loans yet. Apply for a loan to get started."}
          </Text>
          {!(selectedType || selectedStatus) && (
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => router.push('/loans/loan-types')}
            >
              <LinearGradient
                colors={['#1976D2', '#2196F3']}
                style={styles.applyButtonGradient}
              >
                <Text style={styles.applyButtonText}>Apply for a Loan</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      )}
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
    color: '#1565C0',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterScrollContent: {
    paddingRight: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  microIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  clearFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  clearFilterText: {
    fontSize: 14,
    color: '#F44336',
    marginLeft: 4,
  },
  loansList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loanCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  loanType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
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
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  appliedDate: {
    fontSize: 12,
    color: '#757575',
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
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
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  pendingText: {
    color: '#FFC107',
    fontSize: 14,
  },
  rejectedText: {
    color: '#F44336',
    fontSize: 14,
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  applyButton: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 250,
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
  },
}); 