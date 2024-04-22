import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import HttpService from './HttpService';
import { useAuth } from './AuthProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_HOST } from "@env";

const ViewAllChefs = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { userId } = getAuthData();

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/api/users`, null);
        const filteredChefs = response.data.filter(chef => chef.id !== userId);
        setChefs(filteredChefs);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchChefs();
  }, [isFocused]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching chefs: {error}</Text>
      </View>
    );
  }

  const handleChefPress = (chefId) => {
    navigation.navigate('ViewChefsProfile', { chefId });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {chefs.map((chef) => (
          <TouchableOpacity key={chef.id} style={styles.chefContainer} onPress={() => handleChefPress(chef.id)}>
            <Image
              source={{ uri: `${API_HOST}/storage/${chef.images.image}` }}
              style={styles.chefImage}
              onError={(error) => console.error('Image loading error:', error)}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.chefName}>{chef.name}</Text>
              {chef?.isVerified === 1 && (
                <Image
                  source={require("../../assets/Verification-Logo.png")}
                  style={styles.verificationIcon}
                />
              )}
            </View>
            <View style={styles.likesContainer}>
              <Icon name="thumbs-o-up" size={20} color="grey" style={styles.likesIcon} />
              <Text style={styles.likesText}>{chef.totalFollowers}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  chefContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chefImage: {
    width: 320,
    height: 220,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  chefName: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  likesIcon: {
    marginRight: 5,
  },
  likesText: {
    fontSize: 16,
  },
  verificationIcon: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 5,
  },
});

export default ViewAllChefs;
