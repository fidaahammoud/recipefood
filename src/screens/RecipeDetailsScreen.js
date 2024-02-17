import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import the FontAwesome icon library
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook for navigation

import { API_HOST } from "@env";

const BASE_URL = 'http://192.168.56.10:80/laravel'; // Update with your base URL

const RecipeDetails = ({ route }) => {
  const { recipeId } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [recipeImage, setRecipeImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // State to track favorite status
  const [showIngredients, setShowIngredients] = useState(false); // State to track if ingredients are expanded
  const [showSteps, setShowSteps] = useState(false); // State to track if steps are expanded
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`${API_HOST}/recipes/${recipeId}`);
        const data = await response.json();
        setRecipeDetails(data.data);

        // Fetch the image data using the image_id
        const imageResponse = await fetch(`${API_HOST}/images/${data.data.image_id}`);
        const imageData = await imageResponse.json();
        setRecipeImage(`${BASE_URL}/storage/${imageData.data.image}`);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    fetchRecipeDetails();
  }, []);

  const handleFavorite = () => {
    // Toggle favorite status
    setIsFavorite(!isFavorite);
  };

  if (!recipeDetails || !recipeImage) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        
        {/* Favorite Icon */}
        <TouchableOpacity onPress={handleFavorite}>
          <FontAwesome name="heart" size={24} color={isFavorite ? 'red' : 'white'} />
        </TouchableOpacity>
      </View>
      
      {/* Recipe Image */}
      <Image
        source={{ uri: recipeImage }}
        style={styles.image}
      />

      {/* Recipe Details */}
      <Text style={styles.title}>{recipeDetails.title}</Text>
      <Text style={[styles.description, styles.bold]}>Description: {recipeDetails.description}</Text>
      
      {/* Ingredients Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Ingredients</Text>
        <TouchableOpacity onPress={() => setShowIngredients(!showIngredients)}>
          <FontAwesome name={showIngredients ? "angle-down" : "angle-right"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showIngredients && recipeDetails.ingredients.map(ingredient => (
        <Text key={ingredient.id}>{ingredient.ingredientName} - {ingredient.measurementUnit}</Text>
      ))}

      {/* Steps Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Steps</Text>
        <TouchableOpacity onPress={() => setShowSteps(!showSteps)}>
          <FontAwesome name={showSteps ? "angle-down" : "angle-right"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showSteps && recipeDetails.steps.map(step => (
        <Text key={step.id}>{step.stepDescription}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default RecipeDetails;
