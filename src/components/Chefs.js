import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import HttpService from './HttpService';
import { useAuth } from './AuthProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_HOST } from "@env";

const Chefs = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [chefs, setChefs] = useState([]);
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { userId } = getAuthData();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollViewRef = useRef(null);

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

  const handleScrollLeft = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollPosition - 100, animated: true });
      setScrollPosition((prev) => prev - 100);
    }
  };

  const handleScrollRight = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollPosition + 100, animated: true });
      setScrollPosition((prev) => prev + 100);
    }
  };

  useLayoutEffect(() => {
    if (isFocused && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollPosition, animated: false });
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => setScrollPosition(event.nativeEvent.contentOffset.x)}
      >
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
      </ScrollView>

      <TouchableOpacity style={styles.navigationLeft} onPress={handleScrollLeft}>
        <View style={styles.navigationButton}>
          <Icon name="chevron-left" size={20} color="black" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navigationRight} onPress={handleScrollRight}>
        <View style={styles.navigationButton}>
          <Icon name="chevron-right" size={20} color="black" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  chefContainer: {
    marginRight: 15,
    alignItems: 'center',
  },
  chefImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  chefName: {
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
  navigationLeft: {
    position: 'absolute',
    top: '20%',
    left: 10,
    zIndex: 1,
  },
  navigationRight: {
    position: 'absolute',
    top: '20%',
    right: 10,
    zIndex: 1,
  },
  navigationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 8,
  },
  verificationIcon: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 5,
  },
});

export default Chefs;
