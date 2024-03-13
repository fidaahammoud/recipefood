import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import { API_HOST } from "@env";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../components/AuthProvider'; 
const BASE_URL = 'http://192.168.56.10:80/laravel';
import HttpService from './HttpService';
import { Utils } from './Utils'; 
const FavoriteRecipes = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const { getTimeDifference } = Utils();

  useEffect(() => {
    const fetchFavoriteRecipes= async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/users/${userId}/favorites`,token);
        setRecipes(response.data);
  
      } catch (error) {
        setError(error);
      }
    };
  
    fetchFavoriteRecipes();
  }, [isFocused]);

  if (error) {
    return <Text>Error fetching chefs: {error.message}</Text>;
  }


  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetails', { recipeId });
  };

  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text>Error fetching recipes: {error}</Text>}
      {recipes.map((recipe) => (
        <TouchableOpacity key={recipe.id} style={styles.recipeItem} onPress={() => handleRecipePress(recipe.id)}>
          <View style={styles.creatorContainer}>
            <Image source={{ uri: `${BASE_URL}/storage/${recipe.user.images.image}` }} style={styles.creatorImage} />
            <Text style={styles.creatorName}>{recipe.user.name}</Text>
          </View>
          <Image source={{ uri:  `${BASE_URL}/storage/${recipe.images.image}` }} style={styles.recipeImage} />
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <View style={styles.recipeDetails}>
            <View >
              <View style={styles.likesContainer}>
                <Icon name="thumbs-o-up" size={20} color="green" style={styles.likesIcon} />
                <Text style={styles.likesText}>{recipe.totalLikes}</Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="gold" style={styles.ratingIcon} />
              <Text style={styles.ratingText}>{recipe.avrgRating}</Text>
            </View>
          </View>
          <Text style={styles.createdAt}>{getTimeDifference(recipe.created_at)}</Text>
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
  createdAt: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
});

export default FavoriteRecipes;