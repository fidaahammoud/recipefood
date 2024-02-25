import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet,ActivityIndicator} from 'react-native';
import { API_HOST } from "@env";
import { BASE_URL } from "@env";
import HttpService from './HttpService';

const ViewAllChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/users`,null);
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
    <ScrollView>
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
    alignItems: 'center',
    marginBottom: 20, 
    marginTop: 20, 
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
    marginBottom: 8,
  },
});

export default ViewAllChefs;
