import React, { useEffect } from 'react';
import { Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ToastAndroid } from 'react-native';
import { API_HOST } from "@env";
import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService';
import {LogBox} from 'react-native';

LogBox.ignoreAllLogs();

const ImagePickerComponent = ({ buttonTitle, setImageId, imageId, setImageUri ,imageUri}) => {
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  useEffect(() => {
    if (imageUri) {
      saveImageToDatabase(imageUri); 
    }
  }, [imageUri]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
        await setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      ToastAndroid.show('Error picking image, please try again', ToastAndroid.SHORT);
    }
  };

  const saveImageToDatabase = async (imageUri) => {
    try {
      const localHttpService = new HttpService();
      const apiUrl = `${API_HOST}/api/image/${userId}`;
      
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'profile_image.jpg',
        type: 'image/jpg',
      });
  
      const resp = await localHttpService.uploadImage(apiUrl, formData, token);
      if (resp && resp.id) {
        console.log("image id: " + resp.id);
        setImageId(resp.id);
        setImageUri(imageUri);
      } else {
        console.error('Error: Invalid response from server');
        ToastAndroid.show('Error uploading image, please try again', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error during image upload:', error.message);
      ToastAndroid.show('Error uploading image, please try again', ToastAndroid.SHORT);
    }
  };
  

  return (
    <Button title={buttonTitle} onPress={pickImage} color="#5B4444" />
  );
};

export default ImagePickerComponent;
