import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

const LatestRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes data from the API
    fetch('http://192.168.57.10:80/laravel/api/recipes')
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipes.map((recipe) => (
        <View key={recipe.id} style={styles.recipeItem}>
          <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  recipeItem: {
    marginBottom: 16,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LatestRecipes;
