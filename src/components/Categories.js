import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import HttpService from './HttpService';

import { API_HOST } from "@env";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/categories`,null);
        setCategories(response.data);
  
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return <Text>Error fetching chefs: {error}</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map((category) => (
        <View key={category.id} style={styles.categoryContainer}>
          <Image source={{ uri: category.categoryImage }} style={styles.categoryImage} />
          <Text style={styles.categoryName}>{category.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  categoryImage: {
    width: 90,
    height: 90,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 12,
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

export default Categories;
