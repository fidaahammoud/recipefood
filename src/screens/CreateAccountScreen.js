import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider'; 
import { API_HOST } from "@env";

export default function CreateAccount() {
  const navigation = useNavigation();
  const { saveAuthData } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      alert('Password and Confirm Password do not match');
      return;
    }

    const apiUrl = `${API_HOST}/register`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          password_confirmation: confirmPassword,
        }),
      });

      const responseData = await response.text();

      try {
        const respData = JSON.parse(responseData);

        if (response.ok) {
          console.log('Registration successful');

          if (respData && respData.data && respData.data.id && respData.access_token) {
            // Save the token and user ID using the saveAuthData function from useAuth hook
            saveAuthData(respData.access_token, respData.data.id);
            console.log(respData.access_token+ " "+respData.data.id);
            navigation.navigate('CompleteProfile');

          } else {
            console.error('Unexpected response format:', respData);
            alert('Unexpected response format. Please try again.');
          }
        } else {
          console.log('Registration failed:', respData);

          if (response.status === 422 && respData.errors && respData.errors.email) {
            alert('The email has already been taken. Please use a different email.');
          } else {
            alert('Registration failed. Please try again.');
          }
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.log('Raw Response:', responseData);
        alert(`Error parsing server response. Please try again.\n\nRaw Response:\n${responseData}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration. Please try again.');
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/createAccountImg.jpg')}
        style={styles.headerImage}
      />
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.instructionsText}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#654321' }}>
            Let’s start making good {'\n'}meals
          </Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email / Phone Number"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.facebookButton}>
          <Text style={styles.buttonText}>Sign up with Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
