import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView  } from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { API_HOST } from "@env";
import HttpService from '../components/HttpService';
import { useAuth } from '../components/AuthProvider';

const BASE_URL = 'http://192.168.56.10:80/laravel';

const RecipeDetails = ({ route }) => {
  const { recipeId } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [showIngredients, setShowIngredients] = useState(false); 
  const [showSteps, setShowSteps] = useState(false); 
  const [totalLikes, setTotalLikes] = useState(0); 
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { token } = getAuthData();
  const isFocused = useIsFocused();

  const [userRating, setUserRating] = useState(0); 
  const [avgRate, setAvgRate] = useState(0); 


  const fetchRecipeDetails = useCallback(async () => {
    try {
      const httpService = new HttpService();
      const response = await httpService.get(`${API_HOST}/recipes/${recipeId}`);
      setRecipeDetails(response);
      setTotalLikes(response.totalLikes); 
      setAvgRate(parseFloat(response.avrgRating));
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      setError(error);
    }
  }, [recipeId,isFocused]);

  useEffect(() => {
    if (isFocused) {
      fetchRecipeDetails();
    }
  }, [isFocused, fetchRecipeDetails]);

  const handleLikePress = async (recipeId) => {
    try {
      const httpService = new HttpService();
      const response = await httpService.post(`${API_HOST}/recipes/${recipeId}/like`, null, token);
      setTotalLikes(response.nbOfLikes);
    } catch (error) {
      setError(error.message);
    }
  };


  const handleRatingChange = (rating) => {
    setUserRating(rating);
  };

  const submitRating = async () => {
    try {
      const httpService = new HttpService();
      const response = await httpService.post(`${API_HOST}/recipes/${recipeId}/rate/${userRating}`, { rating: userRating }, token);
      console.log(response.avgRating);
      setAvgRate(parseFloat(response.avgRating));
    } catch (error) {
      setError(error.message);
      console.error('Error submitting rating:', error);
    }
  };


  if (!recipeDetails && !error) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error fetching chefs: {error}</Text>;
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const navigateToViewComments = () => {
    navigation.navigate('RecipeComments', { recipeId });
  };


  return (
    <View style={styles.container}>
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
    </View>
    
    <Text style={styles.title}>{recipeDetails.title}</Text>
    <View style={styles.line} />

    <ScrollView horizantal showsHorizontalScrollIndicator={false}>
    <View style={styles.creatorContainer}>
      <Image source={{ uri: `${BASE_URL}/storage/${recipeDetails.user.images.image}` }} style={styles.creatorImage} />
      <Text style={styles.creatorName}>{recipeDetails.user.name}</Text>
    </View>
  
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: `${BASE_URL}/storage/${recipeDetails.images.image}`}}
        style={styles.image}
      />
      <TouchableOpacity onPress={handleFavorite} style={styles.favoriteIconContainer}>
        <FontAwesome name="heart" size={24} color={isFavorite ? 'red' : 'grey'} />
      </TouchableOpacity>
    </View>
  
    <View style={styles.likeAndRatingContainer}>
      <TouchableOpacity style={styles.likeContainer} onPress={() => handleLikePress(recipeDetails.id)}>
        <View style={styles.likesContainer}>
          <Icon name="thumbs-o-up" size={20} color="green" style={styles.likesIcon} />
          <Text style={styles.likesText}>{totalLikes}</Text>
        </View>
      </TouchableOpacity>

      {/* Button to view comments */}
      <TouchableOpacity  style={styles.viewCommentsButton} onPress={() => navigateToViewComments()} >
        <Text style={styles.viewCommentsText}>View Comments</Text>
      </TouchableOpacity>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{avgRate}</Text>
        <Icon name="star" size={20} color="gold" style={styles.ratingIcon} />
      </View>
    </View>


    <Text style={styles.description}>
      <Text style={styles.title}>Description: </Text>
      {recipeDetails.description}
    </Text>  

    <Text style={styles.preparationTime}>
      <Text style={styles.title}>Preparation Time: </Text>
      {recipeDetails.preparationTime} mins
    </Text> 

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Ingredients</Text>
        <TouchableOpacity onPress={() => setShowIngredients(!showIngredients)}>
          <FontAwesome name={showIngredients ? "angle-down" : "angle-right"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showIngredients && recipeDetails.ingredients.map(ingredient => (
        <Text key={ingredient.id}>{ingredient.ingredientName} - {ingredient.measurementUnit}</Text>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Steps</Text>
        <TouchableOpacity onPress={() => setShowSteps(!showSteps)}>
          <FontAwesome name={showSteps ? "angle-down" : "angle-right"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showSteps && recipeDetails.steps.map(step => (
        <Text key={step.id}>{step.stepDescription}</Text>
      ))}
       {/* UI for rating */}
       <View style={styles.addRatingContainer}>
        <Text style={styles.userRatingText}>Your Rating: {userRating}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={userRating}
          onValueChange={handleRatingChange}
        />
      </View>

      {/* Button to submit rating */}
      <TouchableOpacity style={styles.submitRatingButton} onPress={submitRating}>
        <Text style={styles.submitRatingButtonText}>Submit Rating</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  favoriteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',

    textAlign: 'center',
    marginBottom: 10,
  },

  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 7,
  },
  creatorImage: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 8,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',

  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginBottom: 10,
  },
  description: {
    marginTop: 15,
    fontSize: 18,
    marginBottom: 10,
  },
  preparationTime: {
    marginTop: 15,
    fontSize: 18,
    marginBottom: 10,

  },

  bold: {
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  likeAndRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  likeContainer: {
    flexDirection: 'row',
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
    marginTop: 20,
    
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginLeft: 5,
  },
  ratingText: {
    fontSize: 16,
    marginRight: 5,
  },
  viewCommentsButton: {
    backgroundColor: '#5B4444',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCommentsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  slider: {
    width: '100%',
  },
  submitRatingButton: {
    backgroundColor: '#5B4444',
    marginTop:20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitRatingButtonText: {
    color: 'white',
    fontSize: 16,
  },
  addRatingContainer: {
    marginTop:20,

  },
  userRatingText: {
    fontWeight: 'bold',
    fontSize: 16,


  }
});

export default RecipeDetails;
