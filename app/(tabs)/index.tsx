import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  const loanTypes = [
    { 
      id: 'personal',
      title: 'Personal Loan',
      icon: 'person-outline',
      color: '#4264ED',
      description: 'Quick personal loans with minimal documentation',
      interestRate: '10.5%'
    },
    { 
      id: 'business',
      title: 'Business Loan',
      icon: 'business-outline',
      color: '#34C759',
      description: 'Grow your business with flexible loans',
      interestRate: '11.5%'
    },
    { 
      id: 'home',
      title: 'Home Loan',
      icon: 'home-outline',
      color: '#FF9500',
      description: 'Make your dream home a reality',
      interestRate: '8.5%'
    },
    { 
      id: 'gold',
      title: 'Gold Loan',
      icon: 'diamond-outline',
      color: '#FFD700',
      description: 'Quick loans against your gold',
      interestRate: '7.5%'
    },
    { 
      id: 'vehicle',
      title: 'Vehicle Loan',
      icon: 'car-outline',
      color: '#FF3B30',
      description: 'Finance your new vehicle easily',
      interestRate: '9.5%'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.nameText}>TrueLeads</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardSubtext}>
            Find the perfect loan for your needs
          </Text>
          <TouchableOpacity 
            style={styles.calculateButton}
            onPress={() => router.push("/calculator")}
          >
            <Ionicons name="calculator-outline" size={20} color="#4264ED" />
            <Text style={styles.calculateButtonText}>Calculate EMI</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loan Types Section */}
      <View style={styles.loansContainer}>
        <Text style={styles.sectionTitle}>Available Loans</Text>
        
        {loanTypes.map(loan => (
          <TouchableOpacity 
            key={loan.id} 
            style={styles.loanCard}
            onPress={() => router.push(`/loans/${loan.id}`)}
          >
            <View style={[styles.loanIconContainer, { backgroundColor: loan.color + '15' }]}>
              <Ionicons name={loan.icon as any} size={24} color={loan.color} />
            </View>
            <View style={styles.loanInfo}>
              <View>
                <Text style={styles.loanTitle}>{loan.title}</Text>
                <Text style={styles.loanDescription}>{loan.description}</Text>
              </View>
              {/* <View style={styles.rateContainer}>
                <Text style={styles.rateLabel}>Interest Rate</Text>
                <Text style={[styles.rateValue, { color: loan.color }]}>{loan.interestRate}</Text>
              </View> */}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push("/loans/my-loans")}
        >
          <Ionicons name="document-text-outline" size={24} color="#4264ED" />
          <Text style={styles.actionText}>My Loans</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push("/support")}
        >
          <Ionicons name="headset-outline" size={24} color="#4264ED" />
          <Text style={styles.actionText}>Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  welcomeCard: {
    backgroundColor: '#4264ED',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#4264ED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  cardContent: {
    marginTop: 20,
  },
  cardSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 16,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    alignSelf: 'flex-start',
  },
  calculateButtonText: {
    color: '#4264ED',
    fontSize: 14,
    fontWeight: '600',
  },
  loansContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  loanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    gap: 12,
  },
  loanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loanInfo: {
    flex: 1,
    gap: 8,
  },
  loanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  loanDescription: {
    fontSize: 12,
    color: '#666',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateLabel: {
    fontSize: 12,
    color: '#666',
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    width: '45%',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  actionText: {
    color: '#4264ED',
    fontSize: 14,
    fontWeight: '500',
  },
});