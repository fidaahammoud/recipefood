import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { API_HOST } from "@env";
import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService';
import { Utils } from '../components/Utils';

const BASE_URL = 'http://192.168.56.10:80/laravel';

const SearchResultScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { getAuthData } = useAuth();
  const { token } = getAuthData();
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const route = useRoute();
  const { searchQuery } = route.params;

  const { getTimeDifference } = Utils();

  useEffect(() => {
    const fetchSearchRecipes = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.post(`${API_HOST}/recipes/search`, { query: searchQuery }, null);
        setRecipes(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSearchRecipes();
  }, [isFocused]);

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetails', { recipeId });
  };

  if (error) {
    return <Text>Error fetching latest recipes: {error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.searchCriteriaContainer}>
        <Text style={styles.searchCriteriaText}>Search For : {searchQuery}</Text>
        <View style={styles.line} />
      </View>

      {recipes.map((recipe) => (
        <TouchableOpacity key={recipe.id} style={styles.recipeItem} onPress={() => handleRecipePress(recipe.id)}>
          <View style={styles.creatorContainer}>
            <Image source={{ uri: `${BASE_URL}/storage/${recipe.user.images.image}` }} style={styles.creatorImage} />
            <Text style={styles.creatorName}>{recipe.user.name}</Text>
          </View>
          <Image source={{ uri: `${BASE_URL}/storage/${recipe.images.image}` }} style={styles.recipeImage} />
          <View style={styles.titleContainer}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text style={styles.categoryName}>{recipe.category.name}</Text>
          </View>
          <View style={styles.recipeDetails}>
            <View style={styles.likesContainer}>
              <Icon name="thumbs-o-up" size={20} color="green" style={styles.likesIcon} />
              <Text style={styles.likesText}>{recipe.totalLikes}</Text>
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
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black'
  },
  searchCriteriaContainer: {
    alignItems: 'center',
  },
  searchCriteriaText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 30,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginBottom: 10,
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryName: {
    fontSize: 16,
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

export default SearchResultScreen;
