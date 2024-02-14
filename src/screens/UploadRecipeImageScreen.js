import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImagePickerComponent from '../components/ImageHandling'; 
import { useToken } from '../components/TokenProvider'; 
import { API_HOST } from "@env";

const UploadRecipeImageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, recipeId } = route.params; // Retrieve userId from route parameters
  const { getToken } = useToken(); // Use the useToken hook to access getToken function
  const accessToken = getToken(); // Retrieve the access token using getToken function

  // State variable for selected image
  const [image, setImage] = useState(null);

  // Function to handle image upload
  const saveImageToDatabase = async (selectedImage) => {
    try {
      console.log("Access token:", accessToken);
      console.log("user id:", userId);
      console.log("recipe id:", recipeId);

      const apiUrl = `${API_HOST}/image/${userId}/recipe/${recipeId}`;
      console.log(" access token upload image recipe "+accessToken);
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        name: 'recipe_image.jpg',
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
        // Show an error message to the user
        Alert.alert('Error', 'Failed to upload recipe image. Please try again.');
      } else {
        console.log('Recipe image added successfully');
        // Optionally, navigate the user to another screen or provide visual feedback
        navigation.goBack(); // Navigate back after successful upload
      }
    } catch (error) {
      console.error('Error during API call:', error);
      // Show an error message to the user
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
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
});

export default UploadRecipeImageScreen;
