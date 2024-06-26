import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { API_HOST } from "@env";
import HttpService from './HttpService';


const ChefsRecipes = ({ chefId }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/api/users/${chefId}/recipes?sort=-created_at`);
        setRecipes(response.data);
        setLoading(false); 

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false); 
      }
    };

    fetchFavoriteRecipes();
  }, [isFocused]);

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetails', { recipeId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>Error fetching chef's recipes: {error.message}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipes.length === 0 ? (
        <View style={styles.noRecipes}>
          <Text style={styles.noRecipesText}>There are no recipes !</Text>
        </View>
      ) : (
        recipes.map((recipe) => (
          <TouchableOpacity key={recipe.id} style={styles.recipeItem} onPress={() => handleRecipePress(recipe.id)}>
            <View style={styles.creatorContainer}>
              <Image source={{ uri: `${API_HOST}/storage/${recipe.user.images.image}` }} style={styles.creatorImage} />
              <Text style={styles.creatorName}>{recipe.user.name}</Text>
            </View>
            <Image source={{ uri: `${API_HOST}/storage/${recipe.images.image}` }} style={styles.recipeImage} />
            <View style={styles.titleContainer}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.categoryName}>{recipe.category.name}</Text>
            </View>
            <View style={styles.recipeDetails}>
              <View>
                <View style={styles.likesContainer}>
                  <Icon name="thumbs-o-up" size={20} color="grey" style={styles.likesIcon} />
                  <Text style={styles.likesText}>{recipe.totalLikes}</Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={20} color="gold" style={styles.ratingIcon} />
                <Text style={styles.ratingText}>{recipe.avrgRating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 35,
    paddingRight: 25,
    paddingLeft: 25,
  },
  noRecipes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecipesText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeItem: {
    marginBottom: 15,
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
    textTransform: 'capitalize',
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
    textTransform: 'capitalize',
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
});

export default ChefsRecipes;
