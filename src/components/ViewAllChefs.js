import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HttpService from './HttpService';
const BASE_URL = 'http://192.168.56.10:80/laravel';
import { API_HOST } from "@env";

const ViewAllChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/users`, null);
        setChefs(response.data);

      } catch (error) {
        setError(error.message);
      }
    };

    fetchChefs();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching chefs: {error}</Text>
      </View>
    );
  }

  const handleChefPress = (chefId) => {
    // Navigate to the chef's profile details screen
    navigation.navigate('ViewChefsProfile', { chefId });
  };


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {chefs.map((chef) => (
           <TouchableOpacity key={chef.id} style={styles.chefContainer} onPress={() => handleChefPress(chef.id)}>
           <Image
             source={{ uri: `${BASE_URL}/storage/${chef.images.image}`}}
             style={styles.chefImage}
             onError={(error) => console.error('Image loading error:', error)}
           />
           <Text style={styles.chefName}>{chef.name}</Text>
         </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  chefContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chefImage: {
    width: 220,
    height: 220, // Set the height equal to the width to make the image square
    borderRadius: 30, // Optional: add border radius for rounded corners
  },
  chefName: {
    marginTop: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default ViewAllChefs;
