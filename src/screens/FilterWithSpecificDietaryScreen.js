import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import RecipesWithSameDietary from "../components/RecipesWithSameDietary";

const FilterWithSpecificDietaryScreen = () => {
  const navigation = useNavigation(); 
  const route = useRoute();
  const { name, dietaryId } = route.params;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}> Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{name}</Text>

      <View style={styles.line} />

      <RecipesWithSameDietary  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 30,
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
  backButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black'
  },
});

export default FilterWithSpecificDietaryScreen;
