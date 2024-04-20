import React, { useState, useEffect } from 'react';
import { Text, ImageBackground, TextInput, Button, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation ,useIsFocused} from '@react-navigation/native';

import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService';
import ImagePickerComponent from '../components/ImageHandling';
import { API_HOST } from "@env";
import { ToastAndroid } from 'react-native';

const CompleteProfile = () => {
  const navigation = useNavigation();
  const httpService = new HttpService();
  const isFocused = useIsFocused();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [imageId, setImageId] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true); 

  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();


  const [error, setError] = useState(null);
  
  postData = async (data) => {
    try {
      const response = await httpService.put(`${API_HOST}/api/completeProfile/${userId}`,data,token);
      if (response && response.message === 'success' ) {
      console.log(response.user);
      ToastAndroid.show( 'Profile completed successfully' , ToastAndroid.SHORT);

      navigation.navigate('Home');
      }
    } 
    catch (error) {
      setError(error);
    }
  };

  const handleSubmit = async () => {
    if (submitDisabled) return; 
  
    const data = {
      username,
      name: fullName,
      bio: aboutMe,
      image_id: imageId
    };
    postData(data);
  };
  
  useEffect(() => {
    if (username && fullName && imageUri) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [username, fullName, imageUri]);
  
 

  const saveImageToDatabase = async (selectedImage) => {
    try {
      const apiUrl = `${API_HOST}/api/image/${userId}`;
      
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        name: 'profile_image.jpg',
        type: 'image/jpg',
      });
  
      const resp = await httpService.uploadImage(apiUrl, formData, token);
      if (resp && resp.id) {
        setImageId(resp.id);
        setImageUri(selectedImage.uri);
      } else {
        console.error('Error: Invalid response from server');
        ToastAndroid.show("please try again", ToastAndroid.SHORT)
      }
    } catch (error) {
      console.error('Error during image upload:', error);
      ToastAndroid.show("please try again", ToastAndroid.SHORT)
    }
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
        <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase}  buttonTitle="Add a Profile Photo"/>
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleSubmit} color="#5B4444" disabled={submitDisabled} />
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