import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_HOST } from "@env";
//import { BASE_URL } from "@env";
import HttpService from '../components/HttpService';

const BASE_URL = 'http://192.168.56.10:80/laravel';


const RecipeDetails = ({ route }) => {
  const { recipeId } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [showIngredients, setShowIngredients] = useState(false); 
  const [showSteps, setShowSteps] = useState(false); 
  const navigation = useNavigation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/recipes/${recipeId}`);
        //console.log(response);
        setRecipeDetails(response);        
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setError(error);
      }
    };

    fetchRecipeDetails();
  }, []);

 

  if (!recipeDetails) {
    console.log("Recipe details are not available yet.");
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error fetching chefs: {error}</Text>;
  }


  const handleFavorite = () => {
    // Toggle favorite status
    setIsFavorite(!isFavorite);
  };


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
      source={{ uri: `${BASE_URL}/storage/${recipeDetails.images.image}`}}
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
