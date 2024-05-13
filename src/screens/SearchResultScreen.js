import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { API_HOST } from "@env";
import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService';
import { Utils } from '../components/Utils';
import Footer from "../components/Footer"; 


const SearchResultScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { getAuthData } = useAuth();
  const { userId} = getAuthData();
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { searchQuery } = route.params;

  const { getTimeDifference } = Utils();

  useEffect(() => {
    const fetchSearchRecipes = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.post(`${API_HOST}/api/recipes/search`, { query: searchQuery }, null);
        setRecipes(response.data);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching search recipes:', error);
        setError(error.message);
        setLoading(false); 
      }
    };
  
    fetchSearchRecipes();
  }, [isFocused]);
  
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
    return <Text>Error fetching latest recipes: {error}</Text>;
  }

  return (
    <View style={styles.container}>
       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.searchCriteriaContainer}>
          <Text style={styles.searchCriteriaText}>Search For : {searchQuery}</Text>
          <View style={styles.line} />
        </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
       

        {recipes.length === 0 ? (
        <View style={styles.noRecipes}>
          <Text style={styles.noRecipesText}>There are no recipes for {searchQuery} !</Text>
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
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60, 
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  searchCriteriaContainer: {
    alignItems: 'center',
  },
  searchCriteriaText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 50,
  },
  line: {
    width: '80%',
    height: 1,
    backgroundColor: 'black',
    marginBottom: 10,
  },
  recipeItem: {
    marginBottom: 16,
    marginRight:30,
    marginLeft:30,

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchResultScreen;
