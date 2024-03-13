import React, { useState } from 'react';
import { View, Image, TextInput, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import Categories from "../components/Categories";
import Chefs from "../components/Chefs";
import LatestRecipes from "../components/LatestRecipes";
import Footer from "../components/Footer"; 

const HomeScreen = () => {
  const navigation = useNavigation();
  const { getAuthData } = useAuth();
  const { userId } = getAuthData();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortingOption, setSortingOption] = useState('latest'); 
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const handleSearch = async () => {
    navigation.navigate('SearchResults', { searchQuery });
  };

  const openSortModal = () => {
    setModalVisible(true);
  };

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const handleSortingOptionChange = (option) => {
    setSortingOption(option);
    setModalVisible(false); 
  };

  const handleViewFollowings = () => {
    navigation.navigate('followings');
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/logo.jpeg')} style={styles.logo} />
        </View>

        <View style={styles.iconsContainer}>
          <Icon name="filter" size={30} color="black" onPress={openFilterModal} />
          <Icon name="sort" size={30} color="black" onPress={openSortModal} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder="Search..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
            />
            <TouchableOpacity onPress={handleSearch}>
              <Icon name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.categoriesAndChefsContainer}>
          <View style={styles.categoriesContainer}>
            <Text style={styles.boldText}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ViewAllCategories')}>
              <Text style={styles.boldText}>View All</Text>
            </TouchableOpacity>
          </View>
          <Categories />
        </View>

        <View style={styles.chefsContainer}>
          <View style={styles.categoriesContainer}>
            <Text style={styles.boldText}>Chefs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ViewAllChefs')}>
              <Text style={styles.boldText}>View All</Text>
            </TouchableOpacity>
          </View>
          <Chefs />
        </View>

        <View style={styles.latestRecipesContainer}>
          <LatestRecipes sortingOption={sortingOption} />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sort by:</Text>
              <TouchableOpacity onPress={() => handleSortingOptionChange('latest')}>
                <Text style={styles.sortOption}>Latest</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSortingOptionChange('mostLiked')}>
                <Text style={styles.sortOption}>Most Liked</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSortingOptionChange('topRated')}>
                <Text style={styles.sortOption}>Top Rated</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSortingOptionChange('prepTime')}>
                <Text style={styles.sortOption}>Preparation Time</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSortingOptionChange('newest')}>
                <Text style={styles.sortOption}>Newest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => {
          setFilterModalVisible(!filterModalVisible);
        }}>
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleViewFollowings}>
                <Text style={styles.sortOption}>View my followings</Text>
              </TouchableOpacity>
              {/* Other filter options */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  searchContainer: {
    marginTop: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
  },
  categoriesAndChefsContainer: {
    marginTop: 30,
    paddingBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  boldText: {
    color: 'brown',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  chefsContainer: {
    marginTop: 10,
  },
  latestRecipesContainer: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sortOption: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default HomeScreen;
