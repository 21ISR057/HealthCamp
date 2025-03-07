import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { changeLanguage } from '../../constants/i18n';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';

const IndexScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  useEffect(() => {
    const loadStoredLanguage = async () => {
      const storedLang = await AsyncStorage.getItem('language');
      if (storedLang) {
        setSelectedLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      }
    };
    loadStoredLanguage();
  }, []);

  const handleLanguageChange = async (lang: string) => {
    setSelectedLanguage(lang);
    await changeLanguage(lang);
    i18n.changeLanguage(lang);
    Alert.alert(t('selected_language'), t('language_changed_to') + ' ' + lang.toUpperCase());

    setTimeout(() => {
      router.push('/Screens/auth/RoleSelection');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/logos.png')} style={styles.logo} />
      </View>

      {/* Header */}
      <Text style={styles.header}>{t('select_language')}</Text>

      {/* Dropdown */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={handleLanguageChange}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label={t('select_a_language')} value={null} enabled={false} />
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Français" value="fr" />
          <Picker.Item label="Español" value="es" />
          <Picker.Item label="தமிழ்" value="ta" />
        </Picker>
      </View>

      {/* Selected Language Text */}
      <Text style={styles.selectedLang}>{t('selected_language')}: {selectedLanguage.toUpperCase()}</Text>

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/Screens/auth/RoleSelection')}>
        <Text style={styles.buttonText}>{t('continue')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 220,  
    height: 70,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdownContainer: {
    width: '85%',
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    padding: 5,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#2C3E50',
  },
  selectedLang: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#006400', // Dark Green Color
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 10,
    elevation: 4, 
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

