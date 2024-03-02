import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import PersonalInformationComponent from '../components/PersonalInformationComponent';
import RecipeOfUser from '../components/RecipeOfUser';
import FavoriteRecipes from '../components/FavoriteRecipes';
import Footer from '../components/Footer';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { Navigator, Screen } = createMaterialTopTabNavigator();

  const handleSettingsPress = () => {
    // navigation.navigate('Settings');
  };

  const handleEditProfilePress = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
        <Icon name="cog" size={30} color="black" />
      </TouchableOpacity>
      <PersonalInformationComponent />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.profileButton} onPress={handleEditProfilePress}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <Navigator
        screenOptions={{
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#ccc',
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: { backgroundColor: '#5B4444' },
        }}>
        <Screen name="My Recipes" component={RecipeOfUser} />
        <Screen name="Favorite Recipes" component={FavoriteRecipes} />
      </Navigator>
      <Footer />
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
