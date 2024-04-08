import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet,TouchableOpacity } from 'react-native';
import HttpService from './HttpService';
import { useNavigation ,useIsFocused} from '@react-navigation/native';

import { API_HOST } from "@env";

const ViewAllCategories = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/api/categories`, null);
        setCategories(response.data);

      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, [isFocused]);
  

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching categories: {error}</Text>
      </View>
    );
  }

  
  const handleCategoryPress = (categoryId,categoryName) => {
    navigation.navigate('RecipesOfSpecificCategory', { categoryId , categoryName });
  };



  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryContainer} onPress={() => handleCategoryPress(category.id,category.name)}>
          <Image source={{ uri: category.categoryImage }} style={styles.categoryImage} />
          <Text style={styles.categoryName}>{category.name}</Text>
        </TouchableOpacity>
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
    width: 320,
    height: 220, 
    borderRadius: 10, 
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
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
