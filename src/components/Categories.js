import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HttpService from './HttpService';

import { API_HOST } from "@env";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

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

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('RecipesOfSpecificCategory', { categoryId: categoryId });
  };


   return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map((category) => (
        <TouchableOpacity key={category.id} style={styles.categoryContainer} onPress={() => handleCategoryPress(category.id)}>
          <Image source={{ uri: category.categoryImage }} style={styles.categoryImage} />
          <Text style={styles.categoryName}>{category.name}</Text>
        </TouchableOpacity>
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
