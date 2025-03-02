import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter } from 'expo-router';
import { db, storage } from "../../../constants/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from "../../../constants/firebase";
import CheckBox from '@react-native-community/checkbox';

export default function AddCamp() {
  const [campName, setCampName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [motion, setMotion] = useState({
    screenings: false,
    treatments: false,
    healthEducation: false,
  });
  const [benefits, setBenefits] = useState({
    screening: {
      visionHearing: false,
      dental: false,
      nutritional: false,
      bloodPressure: false,
      bloodSugar: false,
    },
    treatments: {
      cataractOperations: false,
      sterilization: false,
      cleftPalateOperations: false,
    },
    healthEducation: {
      basicHealthcare: false,
      diseasePrevention: false,
      healthyLiving: false,
    },
  });
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [image, setImage] = useState<{ uri: string } | null>(null);
  const [showDateFromPicker, setShowDateFromPicker] = useState(false);
  const [showDateToPicker, setShowDateToPicker] = useState(false);

  const router = useRouter();
  const user = auth.currentUser;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  const uploadImage = async (uid: string) => {
    if (!image) return null;

    const imageRef = ref(storage, `healthCamps/${uid}.jpg`);
    const response = await fetch(image.uri);
    const blob = await response.blob();

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handleAddCamp = async () => {
    if (!campName || !orgName || !latitude || !longitude || !registrationUrl || !image) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const campId = new Date().getTime().toString();
      const imageURL = await uploadImage(campId);

      await setDoc(doc(db, "healthCamps", campId), {
        campId,
        campName,
        orgName,
        motion,
        benefits,
        latitude,
        longitude,
        registrationUrl,
        dateFrom,
        dateTo,
        imageURL,
        adminId: user?.uid,
      });

      Alert.alert("Success", "Health Camp Added Successfully!");
      router.push("../Screens/admin/AdminPanel");
    } catch (error) {
      Alert.alert("Error", "Failed to add health camp. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Health Camp</Text>

      <TextInput style={styles.input} placeholder="Camp Name" value={campName} onChangeText={setCampName} />
      <TextInput style={styles.input} placeholder="Organization Name" value={orgName} onChangeText={setOrgName} />

      <Text style={styles.subTitle}>Motion</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox value={motion.screenings} onValueChange={(value:any) => setMotion({ ...motion, screenings: value })} />
        <Text style={styles.label}>Screenings</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={motion.treatments} onValueChange={(value:any) => setMotion({ ...motion, treatments: value })} />
        <Text style={styles.label}>Treatments</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={motion.healthEducation} onValueChange={(value:any) => setMotion({ ...motion, healthEducation: value })} />
        <Text style={styles.label}>Health Education</Text>
      </View>

      <Text style={styles.subTitle}>Benefits of Your Camp</Text>
      <Text style={styles.sectionTitle}>Screening</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.screening.visionHearing} onValueChange={(value:any) => setBenefits({ ...benefits, screening: { ...benefits.screening, visionHearing: value } })} />
        <Text style={styles.label}>Vision and Hearing</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.screening.dental} onValueChange={(value:any) => setBenefits({ ...benefits, screening: { ...benefits.screening, dental: value } })} />
        <Text style={styles.label}>Dental</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.screening.nutritional} onValueChange={(value:any) => setBenefits({ ...benefits, screening: { ...benefits.screening, nutritional: value } })} />
        <Text style={styles.label}>Nutritional</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.screening.bloodPressure} onValueChange={(value:any) => setBenefits({ ...benefits, screening: { ...benefits.screening, bloodPressure: value } })} />
        <Text style={styles.label}>Blood Pressure</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.screening.bloodSugar} onValueChange={(value:any) => setBenefits({ ...benefits, screening: { ...benefits.screening, bloodSugar: value } })} />
        <Text style={styles.label}>Blood Sugar</Text>
      </View>

      <Text style={styles.sectionTitle}>Treatments</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.treatments.cataractOperations} onValueChange={(value:any) => setBenefits({ ...benefits, treatments: { ...benefits.treatments, cataractOperations: value } })} />
        <Text style={styles.label}>Cataract Operations</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.treatments.sterilization} onValueChange={(value:any) => setBenefits({ ...benefits, treatments: { ...benefits.treatments, sterilization: value } })} />
        <Text style={styles.label}>Sterilization</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.treatments.cleftPalateOperations} onValueChange={(value:any) => setBenefits({ ...benefits, treatments: { ...benefits.treatments, cleftPalateOperations: value } })} />
        <Text style={styles.label}>Cleft Palate Operations</Text>
      </View>

      <Text style={styles.sectionTitle}>Health Education</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.healthEducation.basicHealthcare} onValueChange={(value:any) => setBenefits({ ...benefits, healthEducation: { ...benefits.healthEducation, basicHealthcare: value } })} />
        <Text style={styles.label}>Basic Healthcare</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.healthEducation.diseasePrevention} onValueChange={(value:any) => setBenefits({ ...benefits, healthEducation: { ...benefits.healthEducation, diseasePrevention: value } })} />
        <Text style={styles.label}>Disease Prevention</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={benefits.healthEducation.healthyLiving} onValueChange={(value:any) => setBenefits({ ...benefits, healthEducation: { ...benefits.healthEducation, healthyLiving: value } })} />
        <Text style={styles.label}>Healthy Living</Text>
      </View>

      <TextInput style={styles.input} placeholder="Latitude" value={latitude} onChangeText={setLatitude} />
      <TextInput style={styles.input} placeholder="Longitude" value={longitude} onChangeText={setLongitude} />
      <TextInput style={styles.input} placeholder="Registration URL" value={registrationUrl} onChangeText={setRegistrationUrl} />

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDateFromPicker(true)}>
        <Text style={styles.dateButtonText}>Select Date From</Text>
      </TouchableOpacity>
      {showDateFromPicker && (
        <DateTimePicker
          value={dateFrom}
          mode="date"
          display="default"
          onChange={(event:any, selectedDate:any) => {
            setShowDateFromPicker(false);
            if (selectedDate) setDateFrom(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDateToPicker(true)}>
        <Text style={styles.dateButtonText}>Select Date To</Text>
      </TouchableOpacity>
      {showDateToPicker && (
        <DateTimePicker
          value={dateTo}
          mode="date"
          display="default"
          onChange={(event:any, selectedDate:any) => {
            setShowDateToPicker(false);
            if (selectedDate) setDateTo(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>{image ? "Image Selected" : "Upload Image"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAddCamp}>
        <Text style={styles.buttonText}>Add Camp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "#2E7D32",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
    color: "#2E7D32",
  },
  dateButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  dateButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
