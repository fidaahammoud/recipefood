import React from 'react';
import { View, Image, TextInput, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from '@react-navigation/native';
import Categories from "../components/Categories";
import Chefs from "../components/Chefs";
import LatestRecipes from "../components/LatestRecipes";
import Footer from "../components/Footer"; // Import the Footer component

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/logo.jpeg')} style={styles.logo} />
        </View>

        {/* filter and sorting */}
        <View style={styles.iconsContainer}>
          <Icon name="filter" size={30} color="black" onPress={() => console.log('Filter pressed')} />
          <Icon name="sort" size={30} color="black" onPress={() => console.log('Sort pressed')} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
          />
        </View>

        {/* Categories and Chefs container */}
        <View style={styles.categoriesAndChefsContainer}>
          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.boldText}>Categories</Text>
            <Text onPress={() => console.log('View All Categories pressed')} style={styles.boldText}>View All</Text>
          </View>

          {/* Your Categories Component */}
          <Categories />
        </View>

        {/* Chefs */}
        <View style={styles.chefsContainer}>
          <View style={styles.categoriesContainer}>
            <Text style={styles.boldText}>Chefs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ViewAllChefs')}>
              <Text style={styles.boldText}>View All</Text>
            </TouchableOpacity>
          </View>
          <Chefs />
        </View>

        {/* Latest Recipes */}
        <View style={styles.latestRecipesContainer}>
          <Text style={styles.boldText}>Latest Recipes</Text>
          <LatestRecipes />
        </View>
      </ScrollView>

      {/* Footer */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  searchContainer: {
    marginTop: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    borderRadius: 5,
  },
  categoriesAndChefsContainer: {
    marginTop: 30,
    paddingBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  boldText: {
    color: 'brown',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  chefsContainer: {
    marginTop: 10,
  },
  latestRecipesContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;
