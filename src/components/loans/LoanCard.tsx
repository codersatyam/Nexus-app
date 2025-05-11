import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface LoanCardProps {
  title: string;
  amount: number;
  interest: number;
  duration: string;
  onPress: () => void;
}

export const LoanCard = ({ 
  title, 
  amount, 
  interest, 
  duration, 
  onPress 
}: LoanCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>${amount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Interest</Text>
          <Text style={styles.value}>{interest}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>{duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 