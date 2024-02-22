import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import HttpService from './HttpService';

const BASE_URL = 'http://192.168.56.10:80/laravel';
import { API_HOST } from "@env";

const Chefs = () => {
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const httpService = new HttpService(); 

    httpService.get(`${API_HOST}/users`,null)
      .then((response) => {
        const chefsData = response.data.map((chef) => {
          const imageUrl = `${BASE_URL}/storage/${chef.images.image}`;
          return {
            ...chef,
            imageUrl: imageUrl,
          };
        });
        setChefs(chefsData);
      })
      .catch((error) => setError(error.message));
  }, []);

  if (error) {
    return <Text>Error fetching chefs: {error}</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {chefs.map((chef) => (
        <View key={chef.id} style={styles.chefContainer}>
          <Image
            source={{ uri: chef.imageUrl }}
            style={styles.chefImage}
            onError={(error) => console.error('Image loading error:', error)}
          />
          <Text style={styles.chefName}>{chef.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chefContainer: {
    marginRight: 15,
    alignItems: 'center',
  },
  chefImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  chefName: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default Chefs;
