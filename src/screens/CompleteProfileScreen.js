import React, { useState, useEffect, useRef } from 'react';
import { Text, ImageBackground, TextInput, Button, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService';
import ImagePickerComponent from '../components/ImageHandling';
import { API_HOST } from "@env";

const CompleteProfile = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [storedImageUri, setStoredImageUri] = useState(null);
  const imageUriRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();


  const [error, setError] = useState(null);
  
  postData = async (data) => {
    try {
      const httpService = new HttpService();
      const response = await httpService.put(`${API_HOST}/completeProfile/${userId}`,data,token);
      console.log(response.user);
      navigation.navigate('Home');
    } 
    catch (error) {
      setError(error);
    }
  };

  const handleSubmit = async () => {
    const data = {
        username,
        name: fullName,
        bio: aboutMe,
    };
    postData(data);
  };



  useEffect(() => {
    setStoredImageUri(imageUriRef.current);
  }, []);

  const setImage = (uri) => {
    imageUriRef.current = uri;
    setStoredImageUri(uri);
  };

  const httpService = new HttpService();

  const saveImageToDatabase = async (selectedImage) => {
    try {
      const apiUrl = `${API_HOST}/image/${userId}`;
      
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        name: 'profile_image.jpg',
        type: 'image/jpg',
      });

      await httpService.uploadImage(apiUrl, formData, token);
    } catch (error) {
      console.error('Error during image upload:', error);
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     const apiUrl = `${API_HOST}/completeProfile/${userId}`;
  
  //     const response = await httpService.put(apiUrl, {
  //       username,
  //       name: fullName,
  //       bio: aboutMe,
  //     }, token);
  
  //     console.log('Server response:', response);
  
  //     if (response && response.message === "Profile completed successfully") {
  //       console.log(response.message);
  //       console.log(response.user);
  
  //       navigation.navigate('Home');
  //     } else {
  //       console.error(response.message);
  //     }
  //   } catch (error) {
  //     console.error('Error during profile update:', error);
  //   }
  // };
  

  return (
    <ImageBackground
      source={require('../../assets/images/completeProfileBackground.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.formContainer}>
        {storedImageUri && (
          <Image source={{ uri: storedImageUri }} style={styles.photoPreview} />
        )}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={[styles.input, styles.aboutMeInput]}
          placeholder="About me"
          value={aboutMe}
          multiline
          numberOfLines={4}
          onChangeText={setAboutMe}
        />
        <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase} />
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleSubmit} color="#5B4444" />
          {loading && <ActivityIndicator size="small" color="#5B4444" />}
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
    marginTop: 10,
    width: '100%',
  },
});

export default CompleteProfile;
