import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { API_HOST } from "@env";
//import { BASE_URL } from "@env";
import { useRoute } from '@react-navigation/native';

const BASE_URL = 'http://192.168.56.10:80/laravel';

import { useAuth } from '../components/AuthProvider';
import HttpService from './HttpService';

const FetchSameCategoryRecipes = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const { getAuthData } = useAuth();
  const { token } = getAuthData();
  const [error, setError] = useState(null);

  const route = useRoute(); 
  const { categoryId } = route.params;

 
  const fetchRecipes = async () => {
    try {
      const httpService = new HttpService();
      const response = await httpService.get(`${API_HOST}/categories/${categoryId}`, null);
      if (Array.isArray(response.recipes)) {
        setRecipes(response.recipes);
      } else {
        setError('Invalid response format: recipes array not found');
      }
    } catch (error) {
      setError(error.message);
    } 
  };
  useEffect(() => {
    fetchRecipes();
  }, []);

  if (error) {
    return <Text>Error fetching latest recipes: {error}</Text>;
  }

  const handleLikePress = async (recipeId) => {
    // try {
    //   const httpService = new HttpService();
    //   const response =  await httpService.post(`${API_HOST}/recipes/${recipeId}/like`, null, token);
    //   fetchRecipes();
    // } catch (error) {
    //   setError(error.message);
    // }
  };

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetails', { recipeId });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipes.map((recipe) => (
        <TouchableOpacity key={recipe.id} style={styles.recipeItem} onPress={() => handleRecipePress(recipe.id)}>
          <View style={styles.creatorContainer}>
            <Image source={{ uri: `${BASE_URL}/storage/${recipe.user.images.image}` }} style={styles.creatorImage} />
            <Text style={styles.creatorName}>{recipe.user.name}</Text>
          </View>
          <Image source={{ uri: `${BASE_URL}/storage/${recipe.images.image}` }} style={styles.recipeImage} />
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <View style={styles.recipeDetails}>
            <TouchableOpacity onPress={() => handleLikePress(recipe.id)}>
              <View style={styles.likesContainer}>
                <Icon name="thumbs-o-up" size={20} color="green" style={styles.likesIcon} />
                <Text style={styles.likesText}>{recipe.totalLikes}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default FetchSameCategoryRecipes;
