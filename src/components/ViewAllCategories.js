import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import HttpService from './HttpService';

import { API_HOST } from "@env";

const ViewAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/categories`, null);
        setCategories(response.data);

      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching categories: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <Image source={{ uri: category.categoryImage }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
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
  categoryContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryImage: {
    width: 220,
    height: 220, // Set the height equal to the width to make the image square
    borderRadius: 30, // Optional: add border radius for rounded corners
  },
  categoryName: {
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

export default ViewAllCategories;
