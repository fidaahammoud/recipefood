import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { API_HOST } from "@env";
import { useAuth } from './AuthProvider';

const BASE_URL = 'http://192.168.56.10:80/laravel';

const PersonalInformationComponent = () => {
  const { getAuthData } = useAuth();
  const { userId } = getAuthData();
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_HOST}/users/${userId}`);
       
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUserData(userData.data);
        fetchProfileImage(userData.data.image_id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const fetchProfileImage = async (imageId) => {
    try {
      const response = await fetch(`${API_HOST}/images/${imageId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch profile image for user ${userId}`);
      }
      const imageData = await response.json();
      setProfileImage(`${BASE_URL}/storage/${imageData.data.image}`);
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
        <View style={styles.textContainer}>
          {userData && (
            <>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.username}>{userData.username}</Text>
            </>
          )}
        </View>
      </View>
      {userData && (
        <Text style={styles.bio}>  {userData.bio}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
     marginTop: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 20,
   
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  username: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  bio: {
    fontWeight: 'bold',
    paddingTop:20,
  },
});

export default PersonalInformationComponent;
