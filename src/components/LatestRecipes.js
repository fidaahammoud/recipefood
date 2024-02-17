import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_HOST } from "@env";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome Icon

const BASE_URL = 'http://192.168.56.10:80/laravel';

const LatestRecipes = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetails', { recipeId });
  };

  const handleLikePress = (recipeId) => {
    console.log(`Liked recipe: ${recipeId}`);
    // Perform like API call here
  };

  useEffect(() => {
    fetch(`${API_HOST}/recipes?sort=created_at`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        return response.json();
      })
      .then((data) => {
        const recipePromises = data.data.map((recipe) => {
          const imagePromise = fetch(`${API_HOST}/images/${recipe.image_id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch image for recipe ${recipe.id}`);
              }
              return response.json();
            })
            .then((imageData) => {
              const imageUrl = `${BASE_URL}/storage/${imageData.data.image}`;
              return imageUrl;
            });

          const creatorPromise = fetch(`${API_HOST}/users/${recipe.creator_id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch creator for recipe ${recipe.id}`);
              }
              
              return response.json();
            })
            .then((userData) => {
              const imageId = userData.data.image_id;
              return fetch(`${API_HOST}/images/${imageId}`)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`Failed to fetch image for creator ${userData.data.name}`);
                  }
                  return response.json();
                })
                .then((imageData) => {
                  const imageUrl = `${BASE_URL}/storage/${imageData.data.image}`;
                  const creator = {
                    name: userData.data.name,
                    imageUrl: imageUrl,
                  };
                  return creator;
                });
            });

          return Promise.all([imagePromise, creatorPromise])
            .then(([imageUrl, creator]) => {
              return {
                ...recipe,
                imageUrl: imageUrl,
                creator: creator,
              };
            });
        });
        return Promise.all(recipePromises);
      })
      .then((recipesData) => setRecipes(recipesData))
      .catch((error) => setError(error.message));
  }, []);

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
