import React, { useState } from 'react';
import { ImageBackground, TextInput, Button, View, StyleSheet, Image } from 'react-native';

const CompleteProfile = ({ route, navigation }) => {
  const { userId, accessToken } = route.params;

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async () => {
    try {
      const apiUrl = `http://192.168.1.9:80/laravel/api/completeProfile/${userId}`;

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username,
          name: fullName,
          bio: aboutMe,
        }),
      });

      const result = await response.text();

      if (response.ok) {
        // Handle successful response
        console.log(result.message);
        console.log(result.user);

        // Redirect to the home screen
        navigation.navigate('Home'); // Replace 'Home' with the actual name of your home screen
      } else {
        // Handle error response
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error during profile update:', error);
    }
  };

  const handlePhotoUpload = () => {
    // Implement photo upload logic here
    // Set the selected photo using setPhoto
  };

  return (
    <ImageBackground
      source={require('../../assets/images/completeProfileBackground.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={[styles.input, styles.aboutMeInput]}
          placeholder="About me"
          value={aboutMe}
          multiline
          numberOfLines={4}
          onChangeText={setAboutMe}
        />
        <View style={styles.photoContainer}>
          {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}
          <Button title="Upload a photo" onPress={handlePhotoUpload} />
        </View>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#8B4513',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 20,
    color: '#333',
    backgroundColor: '#fff',
    width: '100%',
  },
  aboutMeInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default CompleteProfile;
