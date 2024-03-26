import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import { useNavigation,useIsFocused } from '@react-navigation/native';

import HttpService from './HttpService';

import { API_HOST } from "@env";

const Categories = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    //async function fetchCategories(){}
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
  }, [isFocused]);

  if (error) {
    return <Text>Error fetching chefs: {error}</Text>;
  }

  const handleCategoryPress = (categoryId,categoryName) => {
    navigation.navigate('RecipesOfSpecificCategory', { categoryId , categoryName });
  };


   return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map((category) => (
        <TouchableOpacity key={category.id} style={styles.categoryContainer} onPress={() => handleCategoryPress(category.id,category.name)}>
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
