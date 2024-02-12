import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePickerComponent from '../components/ImageHandling'; 
import { API_HOST } from "@env";

const UploadRecipeImageScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userId, accessToken, recipeId } = route.params;

  // State variable for selected image
  const [image, setImage] = useState(null);

  // Function to handle image upload
  const saveImageToDatabase = async (selectedImage) => {
    try {
      
      const apiUrl = `${API_HOST}/image/${userId}/recipe/${recipeId}`;
      console.log('URL :', apiUrl);
      console.log('recie id :', recipeId);
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
      else{
        console.log('Recipe image added succ.');
        alert('Recipe image added succ.');
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  // Add styles as needed
});

export default UploadRecipeImageScreen;