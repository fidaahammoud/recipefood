import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import ChefsProfileInfo from '../components/ChefsProfileInfo'; 
import ChefsRecipes from '../components/ChefsRecipes'; 

import Icon from 'react-native-vector-icons/Ionicons'; 
import { useNavigation } from '@react-navigation/native';


const ChefsProfileDetails = ({ route }) => {
  const { chefId } = route.params; 
  const navigation = useNavigation();
  
  const handleGoBack = () => {
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="black" /> 
      </TouchableOpacity>
      <ChefsProfileInfo chefId={chefId} />
      
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
