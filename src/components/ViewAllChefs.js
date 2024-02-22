import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { API_HOST } from "@env";
import HttpService from './HttpService';

const BASE_URL = 'http://192.168.56.10:80/laravel';
const ViewAllChefs = () => {
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
    <ScrollView>
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
    alignItems: 'center',
    marginBottom: 20, 
    marginBottom: 20,
  },
  chefImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  chefName: {
    marginTop: 5,
    fontSize: 16, 
    fontWeight: 'bold', 
  },
});

export default ViewAllChefs;
