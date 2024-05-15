import React, { useState , useEffect} from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_HOST } from "@env";
import { useAuth } from '../components/AuthProvider'; 
import HttpService from '../components/HttpService';

export default function Login() {
  const navigation = useNavigation();
  const { saveAuthData,saveStatusOfRecieveNotification  } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginDisabled, setLoginDisabled] = useState(true); 

  const [error, setError] = useState(null);

  const postData = async (data) => {
    try {
      const httpService = new HttpService();
      const response = await httpService.post(`${API_HOST}/api/login`,data,null);
      if (response && response.access_token && response.user_id) {
        saveAuthData(response.access_token, response.user_id);
        const isNotificationActive = response.user.isNotificationActive === 1; 
        console.log(isNotificationActive);
        saveStatusOfRecieveNotification(isNotificationActive);
        navigation.navigate('Home');
      } 
    } 
    catch (error) {
      setError(error);
    }
  };

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password
    };
    postData(data);
  };

  useEffect(() => {
    if (email && password) {
      setLoginDisabled(false);
    } else {
      setLoginDisabled(true);
    }
  }, [email, password]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/loginImg.jpg')} 
        style={styles.headerImage}
      />

      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={styles.loginButton}>Register</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
      <View style={styles.formContainer}>
        <Text style={styles.instructionsText}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#654321' }}>Welcome back to {'\n'}Yumster</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email / Username"
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
        <TouchableOpacity 
          style={[styles.createAccountButton, { opacity: loginDisabled ? 0.5 : 1 }]} 
          onPress={handleLogin}
          disabled={loginDisabled}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
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
    color: '#654321', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginButton: {
    color: '#654321', 
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
