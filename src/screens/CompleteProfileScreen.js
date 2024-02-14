import React, { useState, useEffect, useRef } from 'react';
import { Text, ImageBackground, TextInput, Button, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToken } from '../components/TokenProvider'; 
import ImagePickerComponent from '../components/ImageHandling'; 
import { API_HOST } from "@env";

const CompleteProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [storedImageUri, setStoredImageUri] = useState(null);
  const imageUriRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  // Retrieve user ID from route parameters
  const { userId } = route.params;
  
  // Retrieve access token from token provider
  const { getToken } = useToken(); // Use the useToken hook to access getToken function
  const accessToken = getToken(); // Retrieve the access token using getToken function

  useEffect(() => {
    setStoredImageUri(imageUriRef.current);
  }, []);

  const setImage = (uri) => {
    imageUriRef.current = uri;
    setStoredImageUri(uri);
  };

  const saveImageToDatabase = async (selectedImage) => {
    try {
      console.log('user id:', userId);

      const apiUrl = `${API_HOST}/image/${userId}`;
      console.log('Access Token:', accessToken);

      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        name: 'profile_image.jpg',
        type: 'image/jpg',
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error saving image:', errorData);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const apiUrl = `${API_HOST}/completeProfile/${userId}`;
      console.log('Access Token:', accessToken);
  
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username,
          name: fullName,
          bio: aboutMe,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log(result.message);
        console.log(result.user);
  
        navigation.navigate('Home', { userId: userId });
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error during profile update:', error);
    }
  };

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
        <Button title="Submit" onPress={handleSubmit} />
        {loading && <ActivityIndicator size="small" color="#8B4513" />}
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
});

export default CompleteProfile;
