import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService';
import { API_HOST } from "@env";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { getAuthData, logout } = useAuth(); 
  const { userId, token } = getAuthData();
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const httpService = new HttpService();

  const handleLogout = async () => {
      try {
          const response = await httpService.post(`${API_HOST}/api/logout`, null, token);
          console.log(response);
          logout(); 
          navigation.navigate('Welcome');
      } catch (error) {
          setError(error);
      }
  };

  const handleLogoutConfirmation = () => {
      setShowModal(true);
  };

  const handleConfirmLogout = () => {
      handleLogout();
      setShowModal(false);
  };

  const handleCancelLogout = () => {
      setShowModal(false);
  };

  const handleModalClose = () => {
      setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.back}></View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Settings</Text>
  
      <View style={styles.line} />
  
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleLogoutConfirmation} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
  
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose} // Handle modal close when user taps outside
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text>Are you sure you want to logout?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={handleConfirmLogout}>
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { marginLeft: 20 }]} onPress={handleCancelLogout}>
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20, 
  },
  back: {
    marginTop:20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black'
  },
  topBar: {
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#5B4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#5B4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
