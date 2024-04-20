import React, { useState, useEffect } from 'react';
import { Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ToastAndroid } from 'react-native';

const ImagePickerComponent = ({ setImage, saveImageToDatabase, buttonTitle }) => {

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.cancelled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setImage(result.assets[0].uri);
        saveImageToDatabase(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:in imageHandling ', error);
     // Alert.alert('Error', 'Failed to pick image. Please try again.');
      ToastAndroid.show( 'Error picking image, please try again in imageHandling' , ToastAndroid.SHORT);

    }
  };

  return (
    <>
      <Button title={buttonTitle} onPress={pickImage} color="#5B4444" />
    </>
  );
};

export default ImagePickerComponent;
