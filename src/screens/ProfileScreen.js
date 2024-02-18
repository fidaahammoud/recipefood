import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PersonalInformationComponent from '../components/PersonalInformationComponent';
import { useNavigation } from '@react-navigation/native';
import RecipeOfUser from '../components/RecipeOfUser';
import FavoriteRecipes from '../components/FavoriteRecipes';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [showMyRecipes, setShowMyRecipes] = useState(true);

  const handleSettingsPress = () => {
    //navigation.navigate('Settings');
  };

  const handleMyRecipesPress = () => {
    setShowMyRecipes(true);
  };

  const handleFavoriteRecipesPress = () => {
    setShowMyRecipes(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
        <Icon name="cog" size={30} color="black" />
      </TouchableOpacity>
      <PersonalInformationComponent />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.additionalButtons}>
        <TouchableOpacity
          style={[styles.additionalButton, styles.myRecipesButton, showMyRecipes ? styles.activeButton : null]}
          onPress={handleMyRecipesPress}
        >
          <Text style={styles.buttonText}>My Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.additionalButton, styles.favoriteRecipesButton, !showMyRecipes ? styles.activeButton : null]}
          onPress={handleFavoriteRecipesPress}
        >
          <Text style={styles.buttonText}>Favorite Recipes</Text>
        </TouchableOpacity>
      </View>
      {showMyRecipes ? <RecipeOfUser /> : <FavoriteRecipes />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  profileButton: {
    backgroundColor: '#5B4444',
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  additionalButtons: {
    flexDirection: 'row',
  },
  additionalButton: {
    flex: 1,
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  myRecipesButton: {
    backgroundColor: '#5B4444',
  },
  favoriteRecipesButton: {
    backgroundColor: '#5B4444',
  },
  activeButton: {
    backgroundColor: '#5B4444', 
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
