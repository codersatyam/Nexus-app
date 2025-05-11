import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Modal as RNModal, Animated, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const [userPhone, setUserPhone] = useState('9876543210');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 120],
    extrapolate: 'clamp'
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp'
  });
  const headerNameOpacity = scrollY.interpolate({
    inputRange: [0, 30, 50],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp'
  });
  
  // Load user data from AsyncStorage when component mounts
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      const storedPhone = await AsyncStorage.getItem('userPhone');
      const storedImage = await AsyncStorage.getItem('profileImage');
      
      if (storedName) setUserName(storedName);
      if (storedPhone) setUserPhone(storedPhone);
      if (storedImage) setProfileImage(storedImage);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Clear auth token and relevant user data
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userLoggedIn');
      
      // Keep profile data for quick re-login experience
      
      setShowLogoutModal(false);
      // Small delay for UX
      setTimeout(() => {
        setLoading(false);
        // Navigate to phone number input screen for login
        router.replace('/phone' as any);
      }, 800);
    } catch (error) {
      console.error('Error during logout:', error);
      setLoading(false);
      setShowLogoutModal(false);
    }
  };

  const menuItems = [
    {
      id: 'profile-details',
      title: 'Profile details',
      icon: 'person-outline',
      iconType: 'ionicons',
      badge: null,
      onPress: () => router.push('/profile/details'),
    },
    // {
    //   id: 'notifications',
    //   title: 'Notifications',
    //   icon: 'notifications-outline',
    //   iconType: 'ionicons',
    //   badge: '3',
    //   onPress: () => router.push('/profile/notifications'),
    // },
    {
      id: 'transactions',
      title: 'Transactions',
      icon: 'wallet-outline',
      iconType: 'ionicons',
      badge: null,
      onPress: () => router.push('/profile/settings' as any),
    },
    // {
    //   id: 'kyc',
    //   title: 'KYC Documents',
    //   icon: 'card-account-details-outline',
    //   iconType: 'material',
    //   badge: 'Pending',
    //   badgeColor: '#FF9800',
    //   onPress: () => router.push('/profile/settings' as any),
    // },
    {
      id: 'support',
      title: 'Support',
      icon: 'headset-outline',
      iconType: 'ionicons',
      badge: null,
      onPress: () => router.push('/profile/support'),
    },
    {
      id: 'about',
      title: 'About App',
      icon: 'information-circle-outline',
      iconType: 'ionicons',
      badge: null,
      onPress: () => router.push('/profile/settings' as any),
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'log-out-outline',
      iconType: 'ionicons',
      badge: null,
      onPress: () => setShowLogoutModal(true),
      isDestructive: true,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#003DF5', '#4264ED']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Bubble Animation Background */}
          <View style={styles.bubbleContainer}>
            <View style={[styles.bubble, styles.bubble1]} />
            <View style={[styles.bubble, styles.bubble2]} />
            <View style={[styles.bubble, styles.bubble3]} />
          </View>
          
          {/* Status Bar Space */}
          <View style={styles.statusBarSpace} />

          {/* Profile Header */}
          <Animated.View style={[styles.profileSection, { opacity: headerOpacity }]}>
            <View style={styles.profileRow}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Text style={styles.profileImageInitials}>
                      {userName.split(' ').map(name => name[0]).join('')}
                    </Text>
                  </View>
                )}
              </View>

              {/* Profile Info */}
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{userName}</Text>
                <View style={styles.phoneContainer}>
                  <Feather name="phone" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.phoneNumber}>{userPhone}</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Animated Title Bar */}
        <Animated.View 
          style={[styles.titleBar, { opacity: headerNameOpacity }]}
        >
          <TouchableOpacity onPress={() => router.back()}>  
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/profile/notifications' as any)}>  
            <Ionicons name="notifications-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Menu Items in Scroll View */}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Settings Card */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                item.isDestructive && styles.destructiveItem
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={[
                  styles.iconContainer,
                  item.isDestructive && styles.destructiveIcon
                ]}>
                  {item.iconType === 'ionicons' ? (
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={item.isDestructive ? '#FF3B30' : '#003DF5'}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={20}
                      color={'#003DF5'}
                    />
                  )}
                </View>
                <Text style={[
                  styles.menuItemText,
                  item.isDestructive && styles.destructiveText
                ]}>
                  {item.title}
                </Text>
              </View>
              
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={[styles.badge, item.badgeColor ? { backgroundColor: item.badgeColor } : null]}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                {!item.isDestructive && (
                  <Ionicons name="chevron-forward" size={18} color="#888" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* App Version */}
        <Text style={styles.versionText}>TrueCredit v1.0.0</Text>
      </Animated.ScrollView>
      <RNModal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
      onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="log-out-outline" size={32} color="#FF3B30" />
              <Text style={styles.modalTitle}>Logout</Text>
            </View>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 50,
  },
  statusBarSpace: {
    height: 50,
  },
  bubbleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  bubble1: {
    width: 120,
    height: 120,
    top: -30,
    right: -20,
  },
  bubble2: {
    width: 80,
    height: 80,
    top: 50,
    left: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  bubble3: {
    width: 60,
    height: 60,
    bottom: 20,
    right: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  titleBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    height: 90,
  },
  titleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageInitials: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  phoneNumber: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    marginLeft: 6,
    fontWeight: '500',
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    marginTop: 200, // Initial header height
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  menuContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  destructiveItem: {
    borderRadius: 12,
  },
  destructiveIcon: {
    backgroundColor: '#FFF2F2',
  },
  destructiveText: {
    color: '#FF3B30',
  },
  badge: {
    backgroundColor: '#003DF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    marginTop: 20,
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});