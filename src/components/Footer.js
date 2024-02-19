import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();
  
  const handleUploadPress = () => {
    navigation.navigate('AddRecipe');
  }; 

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  }; 

  const handleHomeePress = () => {
    navigation.navigate('Home');
  }; 
  const handleNotificationPress = () => {
    //navigation.navigate('Notificatio');
  }; 


  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconContainer}onPress={handleHomeePress}>
        <Icon name="home" size={30} color="black" />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={handleUploadPress}>
        <Icon name="upload" size={30} color="black" />
        <Text>Upload</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="bell" size={30} color="black" />
        <Text>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}  onPress={handleProfilePress}>
        <Icon name="user" size={30} color="black" />
        <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
  },
});

export default Footer;
