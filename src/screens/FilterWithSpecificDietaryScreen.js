import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import RecipesWithSameDietary from "../components/RecipesWithSameDietary";
import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from "../components/Footer"; 

const FilterWithSpecificDietaryScreen = () => {
  const navigation = useNavigation(); 
  const route = useRoute();
  const { name, dietaryId } = route.params;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>{name}</Text>

      <View style={styles.line} />

      <RecipesWithSameDietary  />
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  back: {
    marginTop:20
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default FilterWithSpecificDietaryScreen;
