import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_HOST } from "@env";
import { useAuth } from '../components/AuthProvider';
import ImagePickerComponent from '../components/ImageHandling';
import HttpService from '../components/HttpService';


const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const imageUriRef = useRef(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [storedImageUri, setStoredImageUri] = useState(null);

  
  postData = async (data) => {
    try {
      const httpService = new HttpService();
      console.log(`${API_HOST}/updatePersonalInformation/${userId}`);
      const response = await httpService.put(`${API_HOST}/updatePersonalInformation/${userId}`, data, token);
      console.log(response.message);
      console.log(response.user);
      navigation.navigate('Profile');
    }
    catch (error) {
      console.error('Error posting data:', error);
      setError(error);
    }
  };

  const handleSubmit = async () => {
    const data = {};

    // Add fields to data object if they are not empty
    if (name) {
      data.name = name;
    }
    if (username) {
      data.username = username;
    }
    if (bio) {
      data.bio = bio;
    }

 
    postData(data);
  };


  useEffect(() => {
    setStoredImageUri(imageUriRef.current);
  }, []);

  const setImage = (uri) => {
    imageUriRef.current = uri;
    setStoredImageUri(uri);
  };

  const saveImageToDatabase = async (selectedImage) => {
    try {
      const httpService = new HttpService();

      const apiUrl = `${API_HOST}/image/${userId}`;

      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        name: 'profile_image.jpg',
        type: 'image/jpg',
      });

      const response = await httpService.uploadImage(apiUrl, formData, token);
      console.log('Image upload response:', response);
    } catch (error) {
      console.error('Error during image upload:', error);
      setError(error);
    }
  };
  const handleCancel = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase} />
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
        multiline
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: 'gray',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#5B4444',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditProfileScreen;
