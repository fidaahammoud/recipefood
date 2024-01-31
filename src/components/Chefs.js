import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

const Chefs = () => {
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    // Fetch chefs from the API
    fetch('http://192.168.1.9:80/laravel/api/users')
      .then((response) => response.json())
      .then((data) => setChefs(data.data))
      .catch((error) => console.error('Error fetching chefs:', error));
  }, []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {chefs.map((chef) => (
        <View key={chef.id} style={styles.chefContainer}>
          <Image
            source={{ uri: chef.profilePicture }}
            style={styles.chefImage}
          />
          <Text style={styles.chefName}>{chef.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chefContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  chefImage: {
    width: 80, // Replace with hp(8) if you're using a library for responsive design
    height: 80, // Replace with hp(8) if you're using a library for responsive design
    borderRadius: 40,
  },
  chefName: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default Chefs;
