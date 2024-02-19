import React, { useState, useEffect ,useRef} from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_HOST } from "@env";
import { useAuth } from '../components/AuthProvider';
import ImagePickerComponent from '../components/ImageHandling'; 

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const imageUriRef = useRef(null);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
 
  const [storedImageUri, setStoredImageUri] = useState(null);

 
  useEffect(() => {
    setStoredImageUri(imageUriRef.current);
  }, []);

  const setImage = (uri) => {
    imageUriRef.current = uri;
    setStoredImageUri(uri);
  };

  const saveImageToDatabase = async (selectedImage) => {
    try {
      console.log('user id:', userId);

      const apiUrl = `${API_HOST}/image/${userId}`;
      console.log('Access Token:', token);

      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        name: 'profile_image.jpg',
        type: 'image/jpg',
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error saving image:', errorData);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // API call to update user profile
      const apiUrl = `${API_HOST}/updatePersonalInformation/${userId}`;
      const requestBody = {};
      if (name) {
        requestBody.name = name;
      }
      if (username) {
        requestBody.username = username;
      }
      if (bio) {
        requestBody.bio = bio;
      }
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
        navigation.navigate('Profile'); // Navigate back to Home screen
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error during profile update:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
      <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase} />
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#5B4444',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditProfileScreen;
