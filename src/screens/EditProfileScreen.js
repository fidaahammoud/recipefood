import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal, ImageBackground, Image } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import { API_HOST } from "@env";
import ImagePickerComponent from '../components/ImageHandling';
import HttpService from '../components/HttpService';

const EditProfileScreen = () => {
  const httpService = new HttpService();

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  
  const [imageId, setImageId] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null); // New state to manage image URI

  const [isFormValid, setIsFormValid] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [isFocused]);

  const fetchUserDetails = async () => {
    try {
      const response = await httpService.get(`${API_HOST}/users/${userId}`, token);
      const userData = response; 
      setName(userData.name);
      setUsername(userData.username);
      setBio(userData.bio);
      setImageId(userData.image_id.toString());
      // Set image URI if available
      if (userData.image_id) {
        setImageUri(`${API_HOST}/image/${userId}/image/${userData.image_id}`);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    validateForm();
  }, [imageId, isFocused]);

  const validateForm = () => {
    if (
      name.trim() !== '' &&
      username.trim() !== '' &&
      imageId.toString().trim() !== '' 
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const saveImageToDatabase = async (selectedImage) => {
    try {
      const apiUrl = `${API_HOST}/image/${userId}/image`;
      
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        name: 'profile_image.jpg',
        type: 'image/jpg',
      });

      const resp = await httpService.uploadImage(apiUrl, formData, token);
      setImageId(resp.id);
      setImageUri(selectedImage.uri); // Set image URI after upload
    } catch (error) {
      console.error('Error during image upload:', error);
    }
  };

  const handleSave = async () => {
    if (isFormValid) {
      const userData = {
        name,
        username,
        bio,
        image_id: imageId
      };
      try {
        const response = await httpService.put(`${API_HOST}/updatePersonalInformation/${userId}`, userData, token);
        await fetchUserDetails();
        navigation.navigate('Home');
      } catch (error) {
        setError(error);
      }
    }
  };
  
  const handleCancel = () => {
    navigation.navigate('Home');
  };


   return (
    <ImageBackground
      source={require('../../assets/images/completeProfileBackground.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.formContainer}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.photoPreview} />
        )}
        <TextInput
          style={styles.input}
          placeholder="name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, styles.aboutMeInput]}
          placeholder="About me"
          value={bio}
          multiline
          numberOfLines={4}
          onChangeText={setBio}
        />
        <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase} />
        <View style={styles.buttonContainer}>
        <Button title="Cancle" onPress={handleCancel} color="grey"  />
          <Button title="Submit" onPress={handleSave} color="#5B4444"  />

        </View>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#8B4513',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 20,
    color: '#333',
    backgroundColor: '#fff',
    width: '100%',
  },
  aboutMeInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  button: {
    width: '48%', // Adjust width as needed for spacing
  },
});

export default EditProfileScreen;
