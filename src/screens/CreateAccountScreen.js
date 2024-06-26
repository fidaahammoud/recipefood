import React, { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider'; 
import HttpService from '../components/HttpService'; 
import { API_HOST } from "@env";

export default function CreateAccount() {
  const navigation = useNavigation();
  const { saveAuthData } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(true); 

  postData = async (data) => {
    try {
      const httpService = new HttpService();
      const response = await httpService.post(`${API_HOST}/api/register`,data,null);
      saveAuthData(response.access_token, response.user.id);
      navigation.navigate('CompleteProfile');
    } 
    catch (error) {
      setError(error);
    }
  };

  const handleCreateAccount = async () => {
    const data = {
        email: email,
        password: password,
        password_confirmation: confirmPassword,
    };
    postData(data);
  };

  useEffect(() => {
    if (email && password && confirmPassword) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [email, password, confirmPassword]);


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
      <ScrollView>
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
          <TouchableOpacity style={[styles.createAccountButton, submitDisabled && { opacity: 0.5 }]} onPress={handleCreateAccount} disabled={submitDisabled}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.facebookButton}>
          <Text style={styles.buttonText}>Sign up with Facebook</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
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
