import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import ViewAllChefs from "../components/ViewAllChefs";
import { FontAwesome } from '@expo/vector-icons';
import Footer from "../components/Footer"; 

const ViewAllChefsScreen = () => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Chefs</Text>
      </View>

      <View style={styles.line} />

      <ViewAllChefs />
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
  back: {
    marginTop: 30, 
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

export default ViewAllChefsScreen;
