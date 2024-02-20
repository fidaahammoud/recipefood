import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_HOST } from "@env";
import Icon from 'react-native-vector-icons/FontAwesome';
import useRecipeFetcher from "../components/RecipeFetcher";
import { useAuth } from '../components/AuthProvider';

const LatestRecipes = () => {
  const navigation = useNavigation();
  const { recipes, error, setRecipes } = useRecipeFetcher(`${API_HOST}/recipes?sort=-created_at`);
  const { getAuthData } = useAuth();
  const { token } = getAuthData();

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetails', { recipeId });
  };

  const handleLikePress = async (recipeId) => {
    try {
      const response = await fetch(`${API_HOST}/recipes/${recipeId}/like`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to like recipe');
      }
  
      const responseData = await response.json();
      if (responseData.message) {
        Alert.alert(responseData.message);
        // Update the number of likes in the state
        const updatedRecipes = recipes.map(recipe => {
          if (recipe.id === recipeId) {
            return {
              ...recipe,
              nbOfLikes: responseData.nbOfLikes
            };
          }
          return recipe;
        });
        setRecipes(updatedRecipes);
      } else {
        console.warn('Received unexpected response from server:', responseData);
      }
  
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text>Error fetching recipes: {error}</Text>}
      {recipes.map((recipe) => (
        <TouchableOpacity key={recipe.id} style={styles.recipeItem} onPress={() => handleRecipePress(recipe.id)}>
          <View style={styles.creatorContainer}>
            <Image source={{ uri: recipe.creator.imageUrl }} style={styles.creatorImage} />
            <Text style={styles.creatorName}>{recipe.creator.name}</Text>
          </View>
          <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <View style={styles.recipeDetails}>
            <TouchableOpacity onPress={() => handleLikePress(recipe.id)}>
              <View style={styles.likesContainer}>
                <Icon name="thumbs-o-up" size={20} color="green" style={styles.likesIcon} />
                <Text style={styles.likesText}>{recipe.nbOfLikes}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="gold" style={styles.ratingIcon} />
              <Text style={styles.ratingText}>{recipe.avrgRating}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  recipeItem: {
    marginBottom: 16,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesIcon: {
    marginRight: 5,
  },
  likesText: {
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginRight: 5,
  },
  ratingText: {
    fontSize: 16,
  },
});

export default LatestRecipes;