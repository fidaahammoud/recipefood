import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import HttpService from './HttpService';

const BASE_URL = 'http://192.168.56.10:80/laravel';
import { API_HOST } from "@env";

const Chefs = () => {
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const httpService = new HttpService();
        //console.log(`${API_HOST}/users`);
        const response = await httpService.get(`${API_HOST}/users`,null);
        //console.log(response);
        setChefs(response.data);
  
      } catch (error) {
        setError(error);
      }
    };
  
    fetchData();
  }, []);

  if (error) {
    return <Text>Error fetching chefs: {error}</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {chefs.map((chef) => (
        <View key={chef.id} style={styles.chefContainer}>
          <Image
            source={{ uri: `${BASE_URL}/storage/${chef.images.image}`}}
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