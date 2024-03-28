import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ChefsProfileInfo from '../components/ChefsProfileInfo'; 
import ChefsRecipes from '../components/ChefsRecipes'; 
import { useNavigation } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';


const ChefsProfileDetails = ({ route }) => {
  const { chefId } = route.params; 
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
    </View>

      <ChefsProfileInfo chefId={chefId}  />

      <View style={styles.separator} />
      <Text style={styles.recipesText}>Recipes</Text>
      <ChefsRecipes chefId={chefId}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default ChefsProfileDetails;
