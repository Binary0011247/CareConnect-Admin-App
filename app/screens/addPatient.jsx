import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, FlatList } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AddPatientScreen = () => {
  const [patientId, setPatientId] = useState('');
  const [name, setName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [wardBedNo, setWardBedNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [admitDate, setAdmitDate] = useState('');
  const [patients, setPatients] = useState([]);

  const handleAddPatient = () => {
    // Basic validation
    if (!patientId || !name || !diagnosis || !wardBedNo || !mobile || !admitDate) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const newPatient = { patientId, name, diagnosis, wardBedNo, mobile, admitDate };
    setPatients([...patients, newPatient]);

    // Reset input fields after adding patient
    setPatientId('');
    setName('');
    setDiagnosis('');
    setWardBedNo('');
    setMobile('');
    setAdmitDate('');
  };

  const handleSwipeRight = async (patient) => {
    try {
      // Get existing list of patients from AsyncStorage
      const storedPatients = JSON.parse(await AsyncStorage.getItem('patientList')) || [];

      // Add the current patient to the stored list
      await AsyncStorage.setItem('patientList', JSON.stringify([...storedPatients, patient]));

      // Remove the patient from local state
      setPatients(patients.filter((p) => p.patientId !== patient.patientId));
    } catch (error) {
      console.error('Error transferring patient:', error);
    }
  };

  const renderRightActions = () => (
    <View style={styles.completeContainer}>
      <Text style={styles.completeText}>Add to List</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      {/* New Back Button */}
      <TouchableOpacity onPress={() => router.push('/screens/patientlist')} style={styles.backButton} activeOpacity={0.7}>
        <MaterialIcons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Add Patient</Text>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Form Fields */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Patient ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Patient ID"
            value={patientId}
            onChangeText={setPatientId}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Mobile Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Diagnosis:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Diagnosis"
            value={diagnosis}
            onChangeText={setDiagnosis}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Ward/Bed No:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Ward/Bed No"
            value={wardBedNo}
            onChangeText={setWardBedNo}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Admit Date:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Admit Date (YYYY-MM-DD)"
            value={admitDate}
            onChangeText={setAdmitDate}
            keyboardType="default"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddPatient}>
          <Text style={styles.buttonText}>Add Patient</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Swipeable Patient List */}
      <FlatList
        data={patients}
        renderItem={({ item }) => (
          
          <Swipeable
            renderRightActions={renderRightActions}
            onSwipeableRightOpen={() => handleSwipeRight(item)}
          >
            <View style={styles.patientItem}>
              <Text style={styles.patientDetail}>Patient ID: {item.patientId}</Text>
              <Text style={styles.patientDetail}>Name: {item.name}</Text>
              <Text style={styles.patientDetail}>Mobile: {item.mobile}</Text>
              <Text style={styles.patientDetail}>Diagnosis: {item.diagnosis}</Text>
              <Text style={styles.patientDetail}>Ward/Bed No: {item.wardBedNo}</Text>
              <Text style={styles.patientDetail}>Admit Date: {item.admitDate}</Text>
            </View>
          </Swipeable>
          
        )}
        keyExtractor={(item) => item.patientId}
      />
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 40,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    width: '30%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    width: '65%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#8B0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,  // Make sure the button has a clickable area
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional: Add a background for better visibility
    borderRadius: 50,  // Optional: Round the edges for a cleaner look
    zIndex: 1,  // Ensure the button is on top of other elements
  },
  
  patientItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 20,
  },
  patientDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  completeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 10,
  },
  completeText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddPatientScreen;
