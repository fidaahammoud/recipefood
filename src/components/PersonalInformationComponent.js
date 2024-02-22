import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { API_HOST } from "@env";
import { useAuth } from './AuthProvider';
import HttpService from './HttpService'; 

const BASE_URL = 'http://192.168.56.10:80/laravel';

const PersonalInformationComponent = () => {
  const { getAuthData } = useAuth();
  const { userId } = getAuthData();
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const httpService = new HttpService(); 
  
    const fetchUserData = async () => {
      try {
        console.log(userId);
        const response = await httpService.get(`${API_HOST}/users/${userId}`);
        const userData = response; 
        setUserData(userData);
        if(userData && userData.images) {
          setProfileImage(`${BASE_URL}/storage/${userData.images.image}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [userId]);
  

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
