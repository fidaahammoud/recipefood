import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService';
import { API_HOST } from "@env";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5
import Footer from '../components/Footer';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { getAuthData, logout, saveStatusOfRecieveNotification } = useAuth();

  const { userId, token, recieveNotification } = getAuthData();
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(recieveNotification);

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

  const toggleNotification = async () => {
    try {
      const httpService = new HttpService();
      const response = await httpService.put(`${API_HOST}/api/updateIsActiveNotification/${userId}`, null, token);
      setIsNotificationEnabled(!isNotificationEnabled);
      console.log(response.isNotificationActive);
      saveStatusOfRecieveNotification(!isNotificationEnabled);


    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <FontAwesome5 name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.line} />

      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingsIcon} onPress={() => {/* Handle settings icon press */}}>
          <FontAwesome5 name="cog" size={50} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.settingsDescription}>
      <Text style={styles.settingsDescriptionText}>You can log out from here.</Text>
      <Text style={styles.settingsDescriptionText}>Toggle notifications to receive updates.</Text>

      </View>

      <View style={styles.topBar}>
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>Receive Notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isNotificationEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleNotification}
            value={isNotificationEnabled}
          />
        </View>

        <TouchableOpacity onPress={handleLogoutConfirmation} style={styles.logoutText}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => { }}>
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
      <View style={styles.footerContainer}>
        <Footer/>
      </View>
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
    marginTop: 20
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
    marginTop: 15,
  },
  logoutText: {
    marginTop: 20,

  },
  logoutButtonText: {
    color: '#5B4444',
    fontWeight: 'bold',
    fontSize: 20,

  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 18,
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
  settingsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  settingsIcon: {
    marginLeft: 10,
  },
  settingsDescription: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop:10,

  },
  settingsDescriptionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default SettingsScreen;
