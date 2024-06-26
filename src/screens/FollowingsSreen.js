import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity,ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import HttpService from '../components/HttpService';
import { useAuth } from '../components/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { API_HOST } from "@env";
import Footer from '../components/Footer';

const FollowingsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/api/followings/${userId}`, token);
        setChefs(response);
        setLoading(false); 

      } catch (error) {
        setError(error);
        setLoading(false); 

      }
    };

    fetchData();
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>Error fetching chefs: {error.message}</Text>;
  }

  const handleChefPress = (chefId) => {
    navigation.navigate('ViewChefsProfile', { chefId });
  };

  return (
    <View style={styles.container}>
       <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome style={styles.backButton} name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>Followings</Text>
          </View>
          <View style={styles.line} />
      <ScrollView showsVerticalScrollIndicator={false}>
       
        <View style={styles.contentContainer}>
          
          {chefs.length === 0 ? (
            <View style={styles.noRecipes}>
              <Text style={styles.noRecipesText}>There are no Following chefs !</Text>
            </View>
          ) : (
            chefs.map((chef) => (
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
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  noRecipes: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecipesText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 20,
    marginTop: 25,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 5,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titleContainer: {
    marginTop: 20,
    alignItems: 'center',

  },
  line: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
  },
  chefContainer: {
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 20,
  },
  chefImage: {
    width: 320,
    height: 220,
    borderRadius: 30,
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
    textTransform: 'capitalize',
  },
  
  verificationIcon: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FollowingsScreen;
