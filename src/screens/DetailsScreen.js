import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const DetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${route.params.recipeId}`
        );
        const data = await response.json();
        if (data && data.meals && data.meals.length > 0) {
          setRecipeDetails(data.meals[0]);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchRecipeDetails();
  }, [route.params.recipeId]);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleFavoriteToggle} style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}>
        <Ionicons name={isFavorited ? "heart" : "heart-outline"} size={30} color={isFavorited ? "red" : "black"} />
      </TouchableOpacity>
      <View style={{ alignItems: "center", marginTop: 70 }}>
        <View style={{ borderWidth: 1, borderColor: "#888" }}>
          <Image
            source={{ uri: recipeDetails?.strMealThumb }}
            style={{ width: hp(30), height: hp(30), borderRadius: hp(1) }}
          />
        </View>
        <Text style={{ fontSize: hp(3), fontWeight: "bold", marginTop: 20 }}>
          {recipeDetails?.strMeal}
        </Text>
        <Text style={{ fontSize: hp(2), marginTop: 10 }}>
          Category: {recipeDetails?.strCategory}
        </Text>
        <Text style={{ fontSize: hp(2), marginTop: 10 }}>
          Instructions: {recipeDetails?.strInstructions}
        </Text>
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;
