import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

const BASE_URL = 'http://192.168.56.10:80/laravel';
import { API_HOST } from "@env";

const Chefs = () => {
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_HOST}/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch chefs');
        }
        return response.json();
      })
      .then((data) => {
        const chefPromises = data.data.map((chef) => {
          return fetch(`${API_HOST}/images/${chef.image_id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch image for chef ${chef.id}: ${response.statusText}`);
              }
              return response.json();
            })
            .then((imageData) => {
              const imageUrl = `${BASE_URL}/storage/${imageData.data.image}`;
              //console.log("Image URL for chef", chef.id, ":", imageUrl);
              return {
                ...chef,
                imageUrl: imageUrl,
              };
            });
        });
        return Promise.all(chefPromises);
      })
      .then((chefsData) => setChefs(chefsData))
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
