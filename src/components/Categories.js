import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories from the API
    fetch('http://192.168.1.9:80/laravel/api/categories')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setError('An error occurred while fetching categories.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
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
    width: 80,
    height: 80,
   // borderRadius: 40,
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
