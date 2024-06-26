import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation ,useIsFocused } from '@react-navigation/native';
import { API_HOST } from "@env";
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import HttpService from './HttpService';
import { Utils } from './Utils'; 

const RecipesWithSameDietary = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [recipes, setRecipes] = useState([]);
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const [error, setError] = useState(null);
  const [dietaryName, setDietaryName] = useState('');
  const [loading, setLoading] = useState(true); 
  const route = useRoute(); 
  const { dietaryId } = route.params;

  const { getTimeDifference } = Utils();

  const fetchRecipes = async () => {
    try {
      const httpService = new HttpService();
      const response = await httpService.get(`${API_HOST}/api/dietaries/${dietaryId}`, null);
      setDietaryName(response.name); 
      if (Array.isArray(response.recipes)) { 
        setRecipes(response.recipes);
      } else {
        setError('Invalid response format: recipes array not found');
      }
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching recipes for this dietary:', error);
      setError(error);
      setLoading(false); 
    } 
  };

  useEffect(() => {
    fetchRecipes();
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>Error fetching recipes for this dietary: {error.message}</Text>;
  }

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetails', { recipeId });
  }

  const handleCreatorPress = (creatorId) => {
    if (creatorId === userId) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('ViewChefsProfile', { chefId: creatorId });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipes.length === 0 ? (
        <View style={styles.noRecipes}>
          <Text style={styles.noRecipesText}>There are no recipes in {dietaryName}!</Text>
        </View>
      ) : (
        recipes.map((recipe) => (
          <TouchableOpacity key={recipe.id} style={styles.recipeItem} onPress={() => handleRecipePress(recipe.id)}>
            <TouchableOpacity onPress={() => handleCreatorPress(recipe.user.id)}>
              <View style={styles.creatorContainer}>
                <Image source={{ uri: `${API_HOST}/storage/${recipe.user.images.image}` }} style={styles.creatorImage} />
                <Text style={styles.creatorName}>{recipe.user.name}</Text>
                {recipe.user?.isVerified === 1 && (
                  <Image
                    source={require("../../assets/Verification-Logo.png")}
                    style={styles.verificationIcon}
                  />
                )}
              </View>
            </TouchableOpacity>
            <Image source={{ uri: `${API_HOST}/storage/${recipe.images.image}` }} style={styles.recipeImage} />
            <View style={styles.titleContainer}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.categoryName}>{recipe.category.name}</Text>
            </View>
            <View style={styles.recipeDetails}>
              <View style={styles.likesContainer}>
                <Icon name="thumbs-o-up" size={20} color="grey" style={styles.likesIcon} />
                <Text style={styles.likesText}>{recipe.totalLikes}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={20} color="gold" style={styles.ratingIcon} />
                <Text style={styles.ratingText}>{recipe.avrgRating}</Text>
              </View>
            </View>
            <Text style={styles.createdAt}>{getTimeDifference(recipe.created_at)}</Text>
          </TouchableOpacity>
        ))
      )}
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
  noRecipes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecipesText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  verificationIcon: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 5,
  },
});

export default RecipesWithSameDietary;
