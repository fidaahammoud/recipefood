import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ChefsProfileInfo from '../components/ChefsProfileInfo'; 
import ChefsRecipes from '../components/ChefsRecipes'; 
import { useNavigation } from '@react-navigation/native';
import Footer from "../components/Footer"; 
import { FontAwesome } from '@expo/vector-icons';

const ChefsProfileDetails = ({ route }) => {
  const navigation = useNavigation();
  const { chefId } = route.params; 
  
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ChefsProfileInfo chefId={chefId}  />

      <View style={styles.separator} />
      <Text style={styles.recipesText}>Recipes</Text>
      <ChefsRecipes chefId={chefId}/>
      
      <View style={styles.footerContainer}>
        <Footer/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: 'relative', 
    
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'black', 
    marginVertical: 20, 
  },
  recipesText: {
    textAlign: 'center', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ChefsProfileDetails;
