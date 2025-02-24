import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export default function RoleSelectionScreen() {
  const router = useRouter(); 
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);
  const [category, setCategory] = useState<'ngo' | 'healthStudent' | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await AsyncStorage.getItem('language');
      if (lang) {
        i18n.changeLanguage(lang);
      }
    };
    loadLanguage();
  }, []);

  const handleContinue = () => {
    let path = '';
  
    if (selectedRole === 'user') {
      path = '/Screens/auth/RegisterScreenUser';
    } else if (selectedRole === 'admin') {
      if (category === 'ngo') {
        path = '/Screens/auth/RegisterAdmin';
      } else if (category === 'healthStudent') {
        path = '/Screens/auth/AdminHealthRegister';
      } else {
        return; // Ensure category is selected before navigating
      }
    }
  
    if (path) {
      router.push(path as any); // Navigate to the selected path
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('selectRole')}</Text>

      {/* Role Selection (User / Admin) */}
      <View style={styles.selectionContainer}>
        <TouchableOpacity
          style={[styles.option, selectedRole === 'user' && styles.selectedOption]}
          onPress={() => setSelectedRole('user')}
        >
          <Image source={require('../../../assets/images/user.png')} style={styles.image} />
          <Text style={styles.optionText}>{t('user')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selectedRole === 'admin' && styles.selectedOption]}
          onPress={() => setSelectedRole('admin')}
        >
          <Image source={require('../../../assets/images/admin.jpg')} style={styles.image} />
          <Text style={styles.optionText}>{t('admin')}</Text>
        </TouchableOpacity>
      </View>

      {/* Category Selection (Only if Admin is selected) */}
      {selectedRole === 'admin' && (
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={[styles.option, category === 'ngo' && styles.selectedOption]}
            onPress={() => setCategory('ngo')}
          >
            <Image source={require('../../../assets/images/ngo.png')} style={styles.image} />
            <Text style={styles.optionText}>{t('ngo')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, category === 'healthStudent' && styles.selectedOption]}
            onPress={() => setCategory('healthStudent')}
          >
            <Image source={require('../../../assets/images/health_student.jpeg')} style={styles.image} />
            <Text style={styles.optionText}>{t('health_student')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          (!selectedRole || (selectedRole === 'admin' && !category)) && styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={!selectedRole || (selectedRole === 'admin' && !category)}
      >
        <Text style={styles.continueButtonText}>{t('continue')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F9',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2C3E50',
    textAlign: 'center',
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 10,
  },
  selectedOption: {
    borderColor: '#007BFF',
    backgroundColor: '#E3F2FD',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: '#28A745',
    paddingVertical: 12,
    width: '80%',
    alignItems: 'center',
    borderRadius: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  disabledButton: {
    backgroundColor: '#AAB7C4',
  },
});
