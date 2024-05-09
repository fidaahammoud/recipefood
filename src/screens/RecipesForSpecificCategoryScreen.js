import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import FetchSameCategoryRecipes from "../components/FetchSameCategoryRecipes";
import { FontAwesome } from '@expo/vector-icons';
import Footer from "../components/Footer"; 

const RecipesForSpecificCategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryName } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{categoryName}</Text>
      </View>

      <View style={styles.line} />

      <FetchSameCategoryRecipes />
      <View style={styles.footerContainer}>
        <Footer/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20, 
    paddingBottom: 20, 

  },
  titleContainer: {
    marginTop: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default RecipesForSpecificCategoryScreen;
