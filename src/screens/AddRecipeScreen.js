import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { API_HOST } from "@env";
import ImagePickerComponent from '../components/ImageHandling'; 

const RecipeForm = ({ route, navigation }) => {
  
  const { userId, accessToken } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [steps, setSteps] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [comments, setComments] = useState('');
  const [image, setImage] = useState(null);

  const handleSave = async () => {
    try {
      // Prepare recipe data object
      const recipeData = {
        title,
        description,
        category,
        preparationTime: parseInt(preparationTime),
        comment: comments,
        ingredients: [{ ingredientName: ingredients, measurementUnit: 'grams' }],
        preparationSteps: [steps]
      };

      // Send POST request to the backend API to save recipe details
      const response = await fetch(`${API_HOST}/recipes`, {
        method: 'POST',
        headers: {
           Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(recipeData)
      });

      
      if (response.ok) {
        // Recipe creation successful, navigate to image upload screen
        const responseData = await response.json();
        const recipeId = responseData.data.id;

        console.log(recipeId);
        console.log(' saving recipe:', responseData);
        navigation.navigate('ImageUpload', {
          userId,
          accessToken,
          recipeId: recipeId// Assuming the response contains the newly created recipe ID
        });
        
      } else {
        // Handle failed recipe creation
        console.error('Error saving recipe:', error); // Log the error object directly
        if (response.status === 422) {
          // Handle validation errors
          const responseData = await response.json();
          if (responseData.errors) {
            const errorMessages = Object.values(responseData.errors).flat();
            alert(errorMessages.join('\n'));
          } else {
            alert('Failed to save recipe. Please try again ');
          }
        } else {
          // Handle other errors
          alert('Failed to save recipe.');
        }
      }
    } catch (error) {
      console.log(" access token : "+accessToken);
      console.error('Error saving recipe:', error); // Log the error object directly
      alert('Failed to save recipe. Please try again later.');
    }
  };
  
  

  // const saveImageToDatabase = async (selectedImage) => {
  //   try {
      
  //     const apiUrl = `${API_HOST}/image/${userId}/recipe`;
  //     console.log('user id :', userId);
  //     console.log('Access Token:', accessToken);

  //     const formData = new FormData();
  //     formData.append('image', {
  //       uri: selectedImage.uri,
  //       name: 'profile_image.jpg',
  //       type: 'image/jpg',
  //     });

  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error('Error saving image:', errorData);
  //     }
  //   } catch (error) {
  //     console.error('Error during API call:', error);
  //   }
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Enter title"
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        placeholder="Enter description"
      />
      <Text style={styles.label}>Category:</Text>
      <TextInput
        value={category}
        onChangeText={setCategory}
        style={styles.input}
        placeholder="Enter category"
      />
      <Text style={styles.label}>Steps:</Text>
      <TextInput
        value={steps}
        onChangeText={setSteps}
        style={[styles.input, styles.multiline]}
        placeholder="Enter steps"
        multiline
      />
      <Text style={styles.label}>Ingredients:</Text>
      <TextInput
        value={ingredients}
        onChangeText={setIngredients}
        style={[styles.input, styles.multiline]}
        placeholder="Enter ingredients"
        multiline
      />
      <Text style={styles.label}>Preparation Time:</Text>
      <TextInput
        value={preparationTime}
        onChangeText={setPreparationTime}
        style={styles.input}
        placeholder="Enter preparation time"
      />
      <Text style={styles.label}>Comments:</Text>
      <TextInput
        value={comments}
        onChangeText={setComments}
        style={[styles.input, styles.multiline]}
        placeholder="Enter comments"
        multiline
      />
     <Button title="Submit" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  multiline: {
    height: 100, // Adjust as needed
    textAlignVertical: 'top', // For multiline text alignment
  },
});

export default RecipeForm;
