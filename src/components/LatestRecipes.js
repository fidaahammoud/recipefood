import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { API_HOST } from "@env";
import { useAuth } from '../components/AuthProvider';
import HttpService from './HttpService';
import { Utils } from './Utils'; 

const LatestRecipes = ({ sortingOption }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [recipes, setRecipes] = useState([]);
  const { getAuthData } = useAuth();
  const { userId } = getAuthData();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { getTimeDifference } = Utils();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const httpService = new HttpService();
        let url;
        switch (sortingOption) {
          case 'latest':
            url = `${API_HOST}/api/recipes?sort=-created_at`;
            break;
          case 'mostLiked':
            url = `${API_HOST}/api/recipes?sort=-totalLikes`;
            break;
          case 'topRated':
            url = `${API_HOST}/api/recipes?sort=-avrgRating`;
            break;
          case 'prepTime':
            url = `${API_HOST}/api/recipes?sort=+preparationTime`;
            break;
          default:
            url = `${API_HOST}/api/recipes?sort=-created_at`;
        }
        const response = await httpService.get(url, null);
        const activeRecipes = response.data.filter(recipe => recipe.isActive === 1);

        setRecipes(activeRecipes);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [isFocused, sortingOption]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const handleCreatorPress = (creatorId) => {
    if (creatorId === userId) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('ViewChefsProfile', { chefId: creatorId });
    }
  };

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetails', { recipeId });
  };

  if (error) {
    return <Text>Error fetching recipes: {error.message}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipes.map((recipe) => (
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default LatestRecipes;
