import React, { useState } from 'react';
import { View, Text, Button, Modal, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BUSINESS_KEY = 'BUSINESS_LIST';

const BusinessListScreen = ({ navigation }) => {
  const [businessName, setBusinessName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [businesses, setBusinesses] = useState([]);

  const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const saveBusinessData = async (newBusinesses) => {
    await AsyncStorage.setItem(BUSINESS_KEY, JSON.stringify(newBusinesses));
  };

  const addBusiness = () => {
    if (businessName) {
      const newBusiness = { id: generateId(), name: businessName };
      const updatedBusinesses = [...businesses, newBusiness];
      setBusinesses(updatedBusinesses);
      saveBusinessData(updatedBusinesses);
      setBusinessName('');
      setShowModal(false);
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Business name is required');
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Add New Business"
        onPress={() => setShowModal(true)}
      />

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Enter Business Name"
            value={businessName}
            onChangeText={setBusinessName}
            style={styles.input}
          />
          <Button title="Save" onPress={addBusiness} />
          <Button title="Cancel" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default BusinessListScreen;
