import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import HttpService from './HttpService';
import { API_HOST } from "@env";
import Icon from 'react-native-vector-icons/FontAwesome';

const Categories = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/api/categories`, null);
        setCategories(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, [isFocused]);

  if (error) {
    return <Text style={styles.errorText}>Error fetching categories: {error}</Text>;
  }

  const handleCategoryPress = (categoryId, categoryName) => {
    navigation.navigate('RecipesOfSpecificCategory', { categoryId, categoryName });
  };

  const handleScrollLeft = () => {
    scrollViewRef.current.scrollTo({ x: scrollPosition - 100, animated: true });
    setScrollPosition(scrollPosition - 100);
  };

  const handleScrollRight = () => {
    scrollViewRef.current.scrollTo({ x: scrollPosition + 100, animated: true });
    setScrollPosition(scrollPosition + 100);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => setScrollPosition(event.nativeEvent.contentOffset.x)}
      >
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryContainer} onPress={() => handleCategoryPress(category.id, category.name)}>
            <Image source={{ uri: category.categoryImage }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{category.name}</Text>
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
  categoryContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  categoryImage: {
    width: 90,
    height: 90,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 12,
  },
  errorText: {
    color: 'red',
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
  
});

export default Categories;
