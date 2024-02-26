import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { API_HOST } from "@env";
import HttpService from './HttpService'; 

const BASE_URL = 'http://192.168.56.10:80/laravel';

const ChefsProfileInfo = ({ chefId }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonalInformation = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/users/${chefId}`);
        console.log('userData:', response); 
        console.log('name:', response.name); 
        setUserData(response);
      } catch (error) {
        setError(error);
      }
    };
  
    fetchPersonalInformation();
  }, [chefId]);

  if (error) {
    return <Text>Error fetching chef's information: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {userData && userData.images && (
          <Image source={{ uri: `${BASE_URL}/storage/${userData.images.image}` }} style={styles.profileImage} />
        )}
        <View style={styles.textContainer}>
          {userData && (
            <>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.username}>{userData.username}</Text>
              <Text style={styles.bio}>{userData.bio}</Text>

            </>
          )}
        </View>
      </View>

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
  
  

export default ChefsProfileInfo;
