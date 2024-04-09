import React, { useState, useEffect } from 'react';
import { Text, ImageBackground, TextInput, Button, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation ,useIsFocused} from '@react-navigation/native';

import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService';
import ImagePickerComponent from '../components/ImageHandling';
import { API_HOST } from "@env";

const EditProfileScreen = () => {
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
  const [submitDisabled, setSubmitDisabled] = useState(false); 

  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const [error, setError] = useState(null);
  
  useEffect(() => {

    const fetchUserDetails = async () => {
      try {
        const response = await httpService.get(`${API_HOST}/api/users/${userId}/${userId}`, token);
        const userData = response; 
        setFullName(userData.name);
        setUsername(userData.username);
        setAboutMe(userData.bio);
        setImageId(userData.image_id.toString());
        console.log(userData);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [isFocused]);
  
  const handleSubmit = async () => {
    if (submitDisabled) return; 
  
    const data = {
      username,
      name: fullName,
      bio: aboutMe,
      image_id: imageId
    };
  
    console.log(imageId);
      try {
        const response = await httpService.put(`${API_HOST}/api/updatePersonalInformation/${userId}`,data,token);
        console.log(response.user);
        navigation.navigate('Home');
        
      } 
      catch (error) {
        setError(error);
      }
    
  };

  const handleCancel = () => {
    navigation.navigate('Home');
  };

  
  useEffect(() => {
    if (username && fullName && imageId) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [username, fullName,aboutMe,imageId,isFocused]);
  
 

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
      setImageId(resp.id);
      setImageUri(selectedImage.uri); 
    } catch (error) {
      console.error('Error during image upload:', error);
      setImageUri(null);

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
        <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase} buttonTitle="Update Your Profile Photo"/>
        <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Cancel" onPress={handleCancel} color="#888" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Submit" onPress={handleSubmit} color="#5B4444" disabled={submitDisabled} />
          {loading && <ActivityIndicator size="small" color="#5B4444" />}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});


export default EditProfileScreen;