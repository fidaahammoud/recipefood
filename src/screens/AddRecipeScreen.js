import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider'; 
import { API_HOST } from "@env";


const RecipeForm = () => {
  const navigation = useNavigation();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const route = useRoute();
  

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [steps, setSteps] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [comments, setComments] = useState('');
  const [recipeId, setRecipeId] = useState(''); 

  const handleSave = async () => {
    try {
      const recipeData = {
        title,
        description,
        category,
        preparationTime: parseInt(preparationTime),
        comment: comments,
        ingredients: [{ ingredientName: ingredients, measurementUnit: 'grams' }],
        preparationSteps: [steps]
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

        navigation.navigate('ImageUpload', { recipeId: newRecipeId });
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
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again later.');
    }
  };

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
    height: 100, 
    textAlignVertical: 'top', 
  },
});

export default RecipeForm;
