import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ChefsProfileInfo from '../components/ChefsProfileInfo'; 
import ChefsRecipes from '../components/ChefsRecipes'; 
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useNavigation, useIsFocused } from '@react-navigation/native';
import HttpService from '../components/HttpService';
import { useAuth } from '../components/AuthProvider';
import { API_HOST } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { ToastAndroid } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


const ChefsProfileDetails = ({ route }) => {
  const { chefId ,  isFavorite} = route.params; 
  const navigation = useNavigation();
  const [followStatus, setFollowStatus] = useState('Follow'); 
  const { getAuthData } = useAuth();
  const { userId , token} = getAuthData();
  const isFocused = useIsFocused();
  const [error, setError] = useState(null);


  const handleGoBack = () => {
    navigation.goBack(); 
  };


  useEffect(() => {
    const getFollowStatus = async () => {
      try {
        const savedStatus = await AsyncStorage.getItem(`follow_${userId}_${chefId}`);
        if (savedStatus !== null) {
          // Return 'Unfollow' if the saved status is true, otherwise return 'Follow'
          setFollowStatus(JSON.parse(savedStatus) ? 'Unfollow' : 'Follow');
        } else {
          // If the saved status is null, set the default status to 'Follow'
          setFollowStatus('Follow');
        }
      } catch (error) {
        console.error('Error retrieving follow status:', error);
      }
    };
  
    getFollowStatus();
  }, [isFocused]); 
  const handleFollowPress = async () => {
    try {
      const httpService = new HttpService(); 
      const response = await httpService.post(`${API_HOST}/users/${chefId}/toggleFollow`, null, token);

      if (response.message.includes('unfollowed')) {
        setFollowStatus('Follow'); 
        await AsyncStorage.removeItem(`follow_${userId}_${chefId}`);
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      } else if (response.message.includes('following')) {
        setFollowStatus('Unfollow'); 
        await AsyncStorage.setItem(`follow_${userId}_${chefId}`, JSON.stringify(true));
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (error) {
    return <Text>Error fetching chefs:  {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
    </View>

      <ChefsProfileInfo chefId={chefId} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.followButton} onPress={handleFollowPress}>
          <Text style={styles.buttonText}>{followStatus}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <Text style={styles.recipesText}>Recipes</Text>
      <ChefsRecipes chefId={chefId}/>
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
  },
  buttonContainer:{
    alignItems: 'center',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop:30,
    borderWidth: 2, 
    borderColor: '#5B4444'
  },
  buttonText: {
    color: '#5B4444',
    fontWeight: 'bold', 
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'black', 
    marginVertical: 20, 
  },
  recipesText: {
    textAlign: 'center', 
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChefsProfileDetails;
