import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook from react-navigation
import ViewAllChefs from "../components/ViewAllChefs";

const ViewAllChefsScreen = () => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}> Back</Text>
      </TouchableOpacity>

      {/* Chefs title */}
      <Text style={styles.title}>Chefs</Text>

      {/* Line */}
      <View style={styles.line} />

      {/* ViewAllChefs component */}
      <ViewAllChefs />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20, // To give space for the back button
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

export default ViewAllChefsScreen;
