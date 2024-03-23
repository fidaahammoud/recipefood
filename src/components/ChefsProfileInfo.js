import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { API_HOST } from "@env";
import HttpService from './HttpService'; 
import Icon from 'react-native-vector-icons/FontAwesome';

const BASE_URL = 'http://192.168.56.10:80/laravel';

const ChefsProfileInfo = ({ chefId }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchPersonalInformation = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/users/${chefId}`);
        setUserData(response);
      } catch (error) {
        setError(error);
      }
    };
  
    fetchPersonalInformation();
  }, [chefId,isFocused]);

  if (error) {
    return <Text>Error fetching chef's information: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: `${BASE_URL}/storage/${userData?.images?.image}` }} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{userData?.name}</Text>

          <View style={styles.likesContainer}>
              <Icon name="thumbs-o-up" size={20} color="grey" style={styles.likesIcon} />
              <Text style={styles.likesText}>{userData?.totalFollowers}</Text>
        </View>
        
        </View>
      </View>
      <Text style={styles.username}>{userData?.username}</Text>
      <Text style={styles.bio}>{userData?.bio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize:18,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  bio: {
   marginTop:10
  },

  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:10
  },
  likesIcon: {
    marginRight: 5,
  },
  likesText: {
    fontSize: 16,
  },
});

export default ChefsProfileInfo;
