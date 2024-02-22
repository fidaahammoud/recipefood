import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import { API_HOST } from "@env";
import ImagePickerComponent from '../components/ImageHandling';

const RecipeForm = () => {
  const navigation = useNavigation();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const [image, setImage] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [steps, setSteps] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [comments, setComments] = useState('');
  const [recipeId, setRecipeId] = useState('');

  const [imageId, setImageId] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Validate form whenever imageId changes
    validateForm();
  }, [imageId]);

  const validateForm = () => {
    if (title.trim() !== '' && description.trim() !== '' && imageId.toString().trim() !== '' && category.trim() !== '' && ingredients.trim() !== '' && steps.trim() !== '' && preparationTime.trim() !== '' ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };


  const saveImageToDatabase = async (selectedImage) => {
    try {
      const apiUrl = `${API_HOST}/image/${userId}/recipe`;
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
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error saving image:', errorData);
        Alert.alert('Error', 'Failed to upload recipe image. Please try again.');
      } else {
        const result = await response.json();
        setImageId(result.id);
      }
    } catch (error) {
      console.error('Error during API call:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };


  const handleSave = async () => {
    try {
      if (isFormValid) {
        const recipeData = {
          title,
          description,
          category,
          preparationTime: parseInt(preparationTime),
          comment: comments,
          ingredients: [{ ingredientName: ingredients, measurementUnit: 'grams' }],
          preparationSteps: [steps],
          image_id: imageId
        };

        const response = await fetch(`${API_HOST}/recipes`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(recipeData)
        });

        if (response.ok) {
          const responseData = await response.json();
          const newRecipeId = responseData.data.id;
          setRecipeId(newRecipeId);
          navigation.navigate('Home');
        } else {
          console.error('Error saving recipe:', error);
          if (response.status === 422) {
            const responseData = await response.json();
            if (responseData.errors) {
              const errorMessages = Object.values(responseData.errors).flat();
              alert(errorMessages.join('\n'));
            } else {
              alert('Failed to save recipe. Please try again ');
            }
          } else {
            alert('Failed to save recipe.');
          }
        }
      } else {
        alert('Validation Error', 'Please fill in all fields.');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again later.');
    }
  };

  const handleCancel = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        onBlur={validateForm}
        style={styles.input}
        placeholder="Enter title"
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        onBlur={validateForm}
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

      <View style={styles.imagePicker}>
        <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={handleCancel} color="#FF0000" />
        <Button title="Submit" onPress={handleSave} disabled={!isFormValid} color="#5B4444" />
      </View>
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
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RecipeForm;
