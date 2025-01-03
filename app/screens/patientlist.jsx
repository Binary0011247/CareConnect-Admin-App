import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const PatientListScreen = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load the patient list from AsyncStorage
  const loadPatients = async () => {
    try {
      const storedPatients = await AsyncStorage.getItem('patientList');
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
    } catch (error) {
      console.error('Failed to load patient data:', error);
    }
  };

  // Save the patient list to AsyncStorage
  const savePatients = async (patientsToSave) => {
    try {
      await AsyncStorage.setItem('patientList', JSON.stringify(patientsToSave));
    } catch (error) {
      console.error('Failed to save patient data:', error);
    }
  };

  // Handle search functionality
  const handleSearch = () => {
    const filteredPatients = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPatients(filteredPatients);
  };

  // Handle adding a new patient (navigate to AddPatient screen)
  const handleAddPatient = () => {
    router.push('/screens/addPatient');
  };

  // Handle deleting a patient from the list
  const handleDeletePatient = async (patientId) => {
    const updatedPatients = patients.filter((patient) => patient.patientId !== patientId);
    setPatients(updatedPatients);
    await savePatients(updatedPatients); // Save the updated list to AsyncStorage
  };

  useFocusEffect(
    React.useCallback(() => {
      loadPatients();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/screens/adminHome')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Patient List</Text>
        <TouchableOpacity onPress={handleAddPatient} style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={patients}
        renderItem={({ item }) => {
          const initials = item.name
            ? item.name.split(' ').map((word) => word[0]).join('').slice(0, 2)
            : 'NA';

          return (
            <View style={styles.patientItem}>
              <View style={styles.patientInfo}>
                <View style={styles.nameInitials}>
                  <Text style={styles.initials}>{initials}</Text>
                </View>
                <View style={styles.nameDetails}>
                  <Text style={styles.name}>{item.name || 'Unknown'}</Text>
                  <Text style={styles.phone}>{item.mobile}</Text> {/* Updated from 'phone' to 'mobile' */}
                </View>
              </View>
              <View style={styles.patientDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Diagnosis: </Text>
                  <Text style={styles.detailValue}>{item.diagnosis || 'N/A'}</Text> {/* Updated from 'condition' to 'diagnosis' */}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ward/Bed No: </Text> {/* Updated from 'Room' to 'Ward/Bed No' */}
                  <Text style={styles.detailValue}>{item.wardBedNo}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Patient ID: </Text>
                  <Text style={styles.detailValue}>{item.patientId || 'N/A'}</Text>
                </View>
              </View>
              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePatient(item.patientId)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => item.patientId}
        
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#B22222',
    padding: 10,
    borderRadius: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B22222',
    borderRadius: 8,
    padding: 5,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFF',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 5,
    padding: 10,
  },
  patientItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    width:300,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameInitials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  nameDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  phone: {
    fontSize: 14,
    color: '#555',
  },
  patientDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
  detailValue: {
    flex: 2,
    color: '#555',
  },
  patientList: {
    flex: 1,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 20,
  },
});

export default PatientListScreen;
