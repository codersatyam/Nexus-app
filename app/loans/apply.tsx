import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function ApplyLoan() {
  const router = useRouter();

  const loanTypes = [
    {
      id: 'business',
      title: 'Business Loan',
      icon: 'business',
      color: '#007AFF',
    },
    {
      id: 'personal',
      title: 'Personal Loan',
      icon: 'person',
      color: '#34C759',
    },
    {
      id: 'home',
      title: 'Home Loan',
      icon: 'home',
      color: '#FF9500',
    },
    {
      id: 'gold',
      title: 'Gold Loan',
      icon: 'diamond',
      color: '#FFD700',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Choose Loan Type</Text>
      </View>

      <View style={styles.grid}>
        {loanTypes.map((loan) => (
          <TouchableOpacity
            key={loan.id}
            style={[styles.loanCard, { borderColor: loan.color }]}
            onPress={() => router.push(`/loans/${loan.id}`)}
          >
            <Ionicons name={loan.icon as any} size={32} color={loan.color} />
            <Text style={[styles.loanTitle, { color: loan.color }]}>
              {loan.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  loanCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loanTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 