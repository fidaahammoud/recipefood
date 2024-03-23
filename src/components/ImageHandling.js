import React, { useState } from 'react';
import { Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = ({ setImage, saveImageToDatabase,buttonTitle }) => {

  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      saveImageToDatabase(result.assets[0]);
    }
  };

  return (
    <>
      <Button title={buttonTitle} onPress={pickImage} color="#5B4444" />
    </>
  );
};

export default ImagePickerComponent;
