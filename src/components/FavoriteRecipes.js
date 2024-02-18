import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_HOST } from "@env";
import Icon from 'react-native-vector-icons/FontAwesome';
import useRecipeFetcher from "./RecipeFetcher";
import { useAuth } from '../components/AuthProvider'; 

const FavoriteRecipes = () => {
  const navigation = useNavigation();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();

  const { recipes, error } = useRecipeFetcher(`${API_HOST}/users/${userId}/favorites`);
  console.log("favorit recipes api: "+`${API_HOST}/users/${userId}/favorites`);

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetails', { recipeId });
  };

  const handleLikePress = (recipeId) => {
    console.log(`Liked recipe: ${recipeId}`);
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

export default FavoriteRecipes;