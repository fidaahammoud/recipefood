import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Starting() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../assets/images/donuts.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>Yumster</Text>
          <View style={styles.body}>
            <Text style={styles.bodyText}>
              Nutritionally balanced, easy to cook recipes. Quality fresh local ingredients.
            </Text>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('CreateAccount')}
            >
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>
              Already have an account? Login
            </Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    padding: 20,
    borderRadius: 20, 
    width: '80%', 
    alignItems: 'center', 
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
  },
  body: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  bodyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5B4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30, 
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
