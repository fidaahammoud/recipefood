import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import HttpService from './HttpService';
import { useAuth } from './AuthProvider';
import Icon from 'react-native-vector-icons/FontAwesome';

const BASE_URL = 'http://192.168.56.10:80/laravel';
import { API_HOST } from "@env";

const Chefs = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { userId } = getAuthData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/api/users`, null);
        const filteredChefs = response.data.filter(chef => chef.id !== userId);
        setChefs(filteredChefs);
      } catch (error) {
        setError(error);
      }
    };
  
    fetchData();
  }, [isFocused]);

  if (error) {
    return <Text>Error fetching chefs: {error.message}</Text>;
  }

  const handleChefPress = (chefId) => {
    navigation.navigate('ViewChefsProfile', { chefId });
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {chefs.map((chef) => (
        <TouchableOpacity key={chef.id} style={styles.chefContainer} onPress={() => handleChefPress(chef.id)}>
          <Image
            source={{ uri: `${API_HOST}/storage/${chef.images.image}`}}
            style={styles.chefImage}
            onError={(error) => console.error('Image loading error:', error)}
          />
          <Text style={styles.chefName}>{chef.name}</Text>

          <View style={styles.likesContainer}>
            <Icon name="thumbs-o-up" size={20} color="grey" style={styles.likesIcon} />
            <Text style={styles.likesText}>{chef.totalFollowers}</Text>
          </View>

        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chefContainer: {
    marginRight: 15,
    alignItems: 'center',
  },
  chefImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  chefName: {
    marginTop: 5,
    fontSize: 12,
    textTransform: 'capitalize',
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

export default Chefs;
