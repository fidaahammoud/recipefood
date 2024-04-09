import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { API_HOST } from "@env";
import HttpService from './HttpService';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../components/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';


const ChefsProfileInfo = ({ chefId }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const [followStatus, setFollowStatus] = useState('Follow');
  const [totalFollowers, setTotalFollowers] = useState(null);

  const fetchUserData = async () => {
    try {
      const httpService = new HttpService();
      const response = await httpService.get(`${API_HOST}/api/users/${userId}/${chefId}`,token);
      console.log(response);
      setUserData(response);

      if(response.isFollowed){
        setFollowStatus("Unfollow")
      }
      else{
        setFollowStatus("Follow")

      }

    } catch (error) {
      setError(error);
    }
  };

 

  useEffect(() => {
    fetchUserData();
  }, [chefId,totalFollowers, isFocused]);

  const handleFollowPress = async () => {
    try {
      const httpService = new HttpService();
      const response = await httpService.put(`${API_HOST}/api/updateStatusFollow/${userId}/${chefId}`, null, token);
      setTotalFollowers(response.totalFollowers);
      ToastAndroid.show(response.message, ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };
  

  if (error) {
    return <Text>Error fetching chef's information: {error.message}</Text>;
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
        <Text style={styles.likesText}>{totalFollowers !== null ? totalFollowers : userData?.totalFollowers}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.followButton} onPress={handleFollowPress}>
          <Text style={styles.buttonText}>{followStatus}</Text>
        </TouchableOpacity>
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
    fontSize: 18,
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
  buttonContainer: {
    alignItems: 'center',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 30,
    borderWidth: 2,
    borderColor: '#5B4444'
  },
  buttonText: {
    color: '#5B4444',
    fontWeight: 'bold',
  },
});

export default ChefsProfileInfo;
