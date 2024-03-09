import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { API_HOST } from "@env";
import { useAuth } from '../components/AuthProvider';
import ImagePickerComponent from '../components/ImageHandling';
import HttpService from '../components/HttpService';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const imageUriRef = useRef(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [storedImageUri, setStoredImageUri] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(true); 

  useEffect(() => {
    const fetchPersonalInformation = async () => {
      try {
        const httpService = new HttpService();
        console.log(`${API_HOST}/users/${userId}`);
        const response = await httpService.get(`${API_HOST}/users/${userId}`, token);
        setName(response.name);
        setUsername(response.username);
        setBio(response.bio);
      } catch (error) {
        setError(error);
      }
    };
  
    fetchPersonalInformation();
  }, [isFocused]);

 

  const postData = async (data) => {
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
  
    if (name) {
      data.name = name;
    }
    if (username) {
      data.username = username;
    }
    data.bio = bio !== '' ? bio : null;
  
    setSubmitDisabled(true);
  
    await postData(data);
  
    setSubmitDisabled(false);
  };
  

  useEffect(() => {
    setStoredImageUri(imageUriRef.current);
    if (username && name) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [username, name, storedImageUri]);

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
    <ImageBackground
      source={require('../../assets/images/completeProfileBackground.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.formContainer}>
        {storedImageUri && (
          <Image source={{ uri: storedImageUri }} style={styles.photoPreview} />
        )}
          <View style={styles.labelInputContainer}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Full name"
            />
          </View>
          <View style={styles.labelInputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />
          </View>
          <View style={styles.labelInputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Bio"
              multiline
            />
          </View>
          <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            {!submitDisabled && (
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    width: 400, 
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1, 
  },
  input: {
    flex: 3, 
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#5B4444',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
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
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    alignSelf: 'center'
  },
});

export default EditProfileScreen;
