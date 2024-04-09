import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { API_HOST } from "@env";
import { useAuth } from './AuthProvider';
import HttpService from './HttpService'; 
import Icon from 'react-native-vector-icons/FontAwesome';

const BASE_URL = 'http://192.168.56.10:80/laravel';

const PersonalInformationComponent = () => {
  const isFocused = useIsFocused();
  const { getAuthData } = useAuth();
  const { userId,token } = getAuthData();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonalInformation = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/api/users/${userId}/${userId}`,token);
        setUserData(response);
      } catch (error) {
        setError(error);
      }
    };
    fetchPersonalInformation();
  }, [isFocused]);

  if (error) {
    return <Text>Error fetching chefs: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{userData?.name}</Text>
      <View style={styles.imageContainer}>
        {userData && userData.images && (
          <Image source={{ uri: `${API_HOST}/storage/${userData.images.image}` }} style={styles.profileImage} />
        )}
        <View style={styles.textContainer}>
          {userData && (
            <>
              <Text style={styles.username}>{userData.username}</Text>
              <Text style={styles.bio}>{userData.bio}</Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.likesContainer}>
        <Icon name="thumbs-o-up" size={20} color="grey" style={styles.likesIcon} />
        <Text style={styles.likesText}>{userData?.totalFollowers}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
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
    fontSize:18,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  bio: {
    paddingTop: 10,
  },
  likesContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  likesIcon: {
    marginRight: 5,
  },
  likesText: {
    fontSize: 16,
  },
});

export default PersonalInformationComponent;
