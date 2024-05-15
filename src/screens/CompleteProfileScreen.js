import React, { useState, useEffect } from 'react';
import { ImageBackground, TextInput, Button, View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService';
import ImagePickerComponent from '../components/ImageHandling';
import { API_HOST } from "@env";
import { ToastAndroid } from 'react-native';

const CompleteProfile = () => {
  const navigation = useNavigation();
  const httpService = new HttpService();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [imageId, setImageId] = useState('');
  const [imageUri, setImageUri] = useState(null); 
  const [submitDisabled, setSubmitDisabled] = useState(true); 

  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();

  const postData = async (data) => {
    try {
      const response = await httpService.put(`${API_HOST}/api/completeProfile/${userId}`, data, token);
      if (response && response.message === 'success' ) {
        console.log(response.user);
        ToastAndroid.show( 'Profile completed successfully' , ToastAndroid.SHORT);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
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
        <ImagePickerComponent
          buttonTitle="Add a Profile Photo"
          setImageId={setImageId}
          imageId={imageId}
          setImageUri={setImageUri}
          imageUri={imageUri}
        />
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleSubmit} color="#5B4444" disabled={submitDisabled} />
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
