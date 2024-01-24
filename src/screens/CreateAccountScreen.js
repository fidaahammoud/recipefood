import React from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CreateAccount()  {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={require('../../assets/images/createAccountImg.jpg')} 
        style={styles.headerImage}
      />

      {/* Top Container with Buttons */}
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.instructionsText}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#654321' }}>Let’s start making good {'\n'}meals</Text>
          
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email / Phone Number"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.createAccountButton}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.facebookButton}>
          <Text style={styles.buttonText}>Sign up with Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%',
    height: 220, 
    resizeMode: 'cover',
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginButton: {
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  formContainer: {
    marginTop: 20, 
    padding: 10,
  },
  instructionsText: {
    fontSize: 24, 
    color: '#654321', 
    marginBottom: 30, 
    marginLeft: 10,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 25, 
    marginBottom: 30, 
    paddingLeft: 10,
  },
  createAccountButton: {
    backgroundColor: '#5B4444',
    paddingVertical: 15,
    borderRadius: 25, 
    marginBottom: 20, 
  },
  facebookButton: {
    backgroundColor: '#1877f2',
    paddingVertical: 15,
    borderRadius: 25, 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});


