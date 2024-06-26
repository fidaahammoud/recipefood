import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Modal, Pressable, ActivityIndicator, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { API_HOST } from "@env";
import { useAuth } from './AuthProvider';
import HttpService from './HttpService';
import { Utils } from './Utils'; 


const RecipeOfUser = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { getAuthData } = useAuth();
  const { userId , token} = getAuthData();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const httpService = new HttpService();
  const { getTimeDifference } = Utils();

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      setLoading(true); 
      try {
        const response = await httpService.get(`${API_HOST}/api/users/${userId}/recipes?sort=-created_at`);
        setRecipes(response.data);
        setLoading(false); 
      } catch (error) {
        setError(error);
        setLoading(false); 
      }
    };

    fetchFavoriteRecipes();
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>Error fetching recipes: {error}</Text>;
  }

  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetails', { recipeId });
  };

  const handleOptionsPress = (recipe) => {
    setSelectedRecipe(recipe);
    setShowOptions(true);
  };

  const handleEditRecipe = (recipeId) => {
    setShowOptions(false);
    navigation.navigate('EditRecipe', { recipeId: recipeId });
  };

  const handleDeleteRecipe = async () => {
    try {
      const response = await httpService.delete(`${API_HOST}/api/recipes/delete/${selectedRecipe.id}`,token);
      setShowOptions(false);
      setRecipes(recipes.filter(recipe => recipe.id !== selectedRecipe.id));
      ToastAndroid.show('Recipe deleted successfully!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      ToastAndroid.show('Failed to delete recipe. Please try again later.', ToastAndroid.SHORT);
    }
  };

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
            <View style={styles.creatorTextContainer}>
              <Text style={styles.creatorName}>{recipe.user.name}</Text>
              {recipe.user?.isVerified === 1 && (
                <Image
                  source={require("../../assets/Verification-Logo.png")}
                  style={styles.verificationIcon}
                />
              )}
            </View>
            <TouchableOpacity onPress={() => handleOptionsPress(recipe)}>
              <Icon name="ellipsis-h" size={20} color="black" style={styles.optionsIcon} />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: `${API_HOST}/storage/${recipe.images.image}` }} style={styles.recipeImage} />
          <View style={styles.titleContainer}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text style={styles.categoryName}>{recipe.category.name}</Text>
          </View>
          <View style={styles.recipeDetails}>
            <View >
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
          <Text style={styles.createdAt}>{getTimeDifference(recipe.created_at)}</Text>
        </TouchableOpacity>
      ))
    )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptions}
        onRequestClose={() => setShowOptions(false)}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.modalContent}>
            <Pressable onPress={() => handleEditRecipe(selectedRecipe.id)}>
              <Text style={styles.modalOption}>Edit Recipe</Text>
            </Pressable>
            <Pressable onPress={handleDeleteRecipe}>
              <Text style={styles.modalOption}>Delete Recipe</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
    fontSize: 16,
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
  creatorTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  optionsIcon: {
    marginLeft: 'auto',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalOption: {
    fontSize: 18,
    paddingVertical: 10,
  },
  createdAt: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  verificationIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
});

export default RecipeOfUser;
