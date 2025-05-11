import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

export default function UploadPAN() {
  const { amount, tenure } = useLocalSearchParams<{ amount: string, tenure: string }>();
  const [panImage, setPanImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Handle picking an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant access to your photos to upload PAN card.");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setPanImage(result.assets[0].uri);
    }
  };
  
  // Handle taking a photo with the camera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant access to your camera to take a photo of your PAN card.");
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setPanImage(result.assets[0].uri);
    }
  };
  
  // Handle submitting the PAN card
  const handleSubmit = () => {
    if (!panImage) {
      Alert.alert("Upload Required", "Please upload your PAN card to continue.");
      return;
    }
    
    setIsUploading(true);
    
    // Simulate API call to submit PAN
    setTimeout(() => {
      setIsUploading(false);
      router.push({
        pathname: "/loans/success",
        params: { amount, tenure }
      });
    }, 2000);
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
        <Text style={styles.title}>Upload PAN Card</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.uploadSection}>
            <View style={styles.loanDetailsCard}>
              <Text style={styles.detailsTitle}>Loan Application</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Amount:</Text>
                <Text style={styles.detailsValue}>₹{parseInt(amount || '0').toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Tenure:</Text>
                <Text style={styles.detailsValue}>{tenure} Months</Text>
              </View>
            </View>
          
            <Text style={styles.sectionTitle}>PAN Card Verification</Text>
            <Text style={styles.subtitle}>Please upload a clear image of your PAN card for verification</Text>
            
            <View style={styles.imageContainer}>
              {panImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: panImage }} style={styles.panImage} />
                  <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
                    <Text style={styles.changeImageText}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="card-outline" size={48} color="#1976D2" />
                  <Text style={styles.placeholderText}>No PAN card image uploaded</Text>
                </View>
              )}
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Ionicons name="images-outline" size={20} color="#1976D2" />
                <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={20} color="#1976D2" />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.guidelinesContainer}>
              <Text style={styles.guidelinesTitle}>Upload Guidelines:</Text>
              <View style={styles.guideline}>
                <Ionicons name="checkmark-circle" size={16} color="#1976D2" />
                <Text style={styles.guidelineText}>Ensure the PAN card is clearly visible</Text>
              </View>
              <View style={styles.guideline}>
                <Ionicons name="checkmark-circle" size={16} color="#1976D2" />
                <Text style={styles.guidelineText}>All details should be readable</Text>
              </View>
              <View style={styles.guideline}>
                <Ionicons name="checkmark-circle" size={16} color="#1976D2" />
                <Text style={styles.guidelineText}>File size should be less than 5MB</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.submitButton, !panImage && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!panImage || isUploading}
          >
            <LinearGradient
              colors={panImage ? ['#1976D2', '#2196F3', '#1976D2'] : ['#CCCCCC', '#DDDDDD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButtonGradient}
            >
              {isUploading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

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
  uploadSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 25,
  },
  loanDetailsCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailsLabel: {
    fontSize: 14,
    color: '#555',
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: '#1976D2',
    borderStyle: 'dashed',
    borderRadius: 10,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(25, 118, 210, 0.05)',
    overflow: 'hidden',
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  panImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  changeImageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.3)',
  },
  uploadButtonText: {
    color: '#1976D2',
    marginLeft: 8,
    fontWeight: '500',
  },
  guidelinesContainer: {
    backgroundColor: 'rgba(25, 118, 210, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  guideline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guidelineText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#555',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
});
