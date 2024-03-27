import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView  } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { API_HOST } from "@env";
import HttpService from '../components/HttpService';
import { useAuth } from '../components/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = 'http://192.168.56.10:80/laravel';
import { Utils } from '../components/Utils'; 

const RecipeDetails = ({ route }) => {
  const { recipeId } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [showIngredients, setShowIngredients] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { token, userId } = getAuthData();
  const isFocused = useIsFocused();
  const [userRating, setUserRating] = useState(0);
  const [avgRate, setAvgRate] = useState(0);
  const { getTimeDifference } = Utils();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/recipes/${recipeId}`);
        setRecipeDetails(response);
        setTotalLikes(response.totalLikes);
        setAvgRate(parseFloat(response.avrgRating));
      } catch (error) {
        console.error('Error fetching recipe details:', error.message);
        setError(error);
      }
    };

    fetchRecipeDetails();
  }, [recipeId, isFocused]);

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      try {
        const favoriteStatus = await AsyncStorage.getItem(`favorite_${userId}_${recipeId}`);
        if (favoriteStatus !== null) {
          setIsFavorite(JSON.parse(favoriteStatus));
        }
      } catch (error) {
        console.error('Error loading favorite status:', error);
      }
    };

    const loadLikeStatus = async () => {
      try {
        const likeStatus = await AsyncStorage.getItem(`like_${userId}_${recipeId}`);
        if (likeStatus !== null) {
          setIsLiked(JSON.parse(likeStatus));
        }
      } catch (error) {
        console.error('Error loading like status:', error);
      }
    };

    loadFavoriteStatus();
    loadLikeStatus();
  }, [recipeId, userId]);

  useEffect(() => {
    const loadUserRating = async () => {
      try {
        const storedRating = await AsyncStorage.getItem(`rating_${userId}_${recipeId}`);
        if (storedRating !== null) {
          setUserRating(parseInt(storedRating));
        }
      } catch (error) {
        console.error('Error loading user rating:', error);
      }
    };

    loadUserRating();
  }, [recipeId, userId]);

  const handleLikePress = async (recipeId) => {
    try {
      const httpService = new HttpService();
      const response = await httpService.post(`${API_HOST}/recipes/${recipeId}/like`, null, token);
      setTotalLikes(response.nbOfLikes);
      setIsLiked(!isLiked);
      await AsyncStorage.setItem(`like_${userId}_${recipeId}`, JSON.stringify(!isLiked));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFavoritePress = async (recipeId) => {
    try {
      const httpService = new HttpService();
      const response = await httpService.post(`${API_HOST}/recipes/${recipeId}/addToFavorite`, null, token);
      setIsFavorite(!isFavorite);
      await AsyncStorage.setItem(`favorite_${userId}_${recipeId}`, JSON.stringify(!isFavorite));
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
      setAvgRate(parseFloat(response.avgRating));
      await AsyncStorage.setItem(`rating_${userId}_${recipeId}`, userRating.toString());
    } catch (error) {
      setError(error);
      console.error('Error submitting rating:', error.message);
    }
  };

  if (error) {
    return <Text>Error fetching recipe details: {error.message}</Text>;
  }
  if (!recipeDetails) {
    return <Text>Loading...</Text>;
  }

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
      <TouchableOpacity onPress={() => handleFavoritePress(recipeDetails.id)} style={styles.favoriteIconContainer}>
        <FontAwesome name="heart" size={24} color={isFavorite ? 'red' : 'grey'} />
      </TouchableOpacity>
    </View>
  
    <View style={styles.likeAndRatingContainer}>
      <TouchableOpacity style={styles.likeContainer} onPress={() => handleLikePress(recipeDetails.id)}>
        <View style={styles.likesContainer}>
        <Icon name="thumbs-o-up" size={20} color={isLiked ? 'red' : 'grey'} style={styles.likesIcon} />
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

    <Text style={styles.createdAt}>{getTimeDifference(recipeDetails.created_at)}</Text>

    <Text style={styles.description}>
      <Text style={styles.title}>Description: </Text>
      {recipeDetails.description}
    </Text>  

    <Text style={styles.category}>
      <Text style={styles.title}>Category: </Text>
      {recipeDetails.category.name}
    </Text> 

    <Text style={styles.dietary}>
      <Text style={styles.title}>Dietary Preference: </Text>
      {recipeDetails.dietary.name}
    </Text> 

    <Text style={styles.preparationTime}>
      <Text style={styles.title}>Preparation Time: </Text>
      {recipeDetails.preparationTime} mins
    </Text> 

    <Text style={styles.comment}>
      <Text style={styles.title}>Chefs comment: </Text>
      {recipeDetails.comment}
    </Text> 

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Ingredients</Text>
        <TouchableOpacity onPress={() => setShowIngredients(!showIngredients)}>
          <FontAwesome name={showIngredients ? "angle-down" : "angle-right"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showIngredients && recipeDetails.ingredients.map(ingredient => (
        <View key={ingredient.id} style={styles.ingredient}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.ingredientText}>{ingredient.ingredientName} - {ingredient.measurementUnit}</Text>
      </View>
        ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Steps</Text>
        <TouchableOpacity onPress={() => setShowSteps(!showSteps)}>
          <FontAwesome name={showSteps ? "angle-down" : "angle-right"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showSteps && recipeDetails.steps.map(step => (
        <View key={step.id} style={styles.step}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.stepText}>{step.stepDescription}</Text>
      </View>
      ))}
       
        {/* UI for rating */}
        <View style={styles.addRatingContainer}>
          <Text style={styles.userRatingText}>Your Rating: {userRating}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => handleRatingChange(star)}>
                <Icon name={userRating >= star ? "star" : "star-o"} size={30} color="gold" style={styles.starIcon} />
              </TouchableOpacity>
            ))}
          </View>
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
    fontSize: 20,
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
    fontSize: 22,
    marginBottom: 10,
  },
  category: {
    marginTop: 15,
    fontSize: 22,
    marginBottom: 10,

  },

  dietary: {
    marginTop: 15,
    fontSize: 22,
    marginBottom: 10,

  },
  preparationTime: {
    marginTop: 15,
    fontSize: 22,
    marginBottom: 10,

  },
  comment: {
    marginTop: 15,
    fontSize: 22,
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
    marginTop: 15,
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
  
  starsContainer: {
    flexDirection: 'row',
    marginTop:15
  },
  starIcon: {
    marginRight: 5,
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
  },
  createdAt: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 3,
    backgroundColor: 'black',
    marginRight: 5,
  },
  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientText: {
    fontSize:20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    fontSize:20,

  },

});

export default RecipeDetails;
