import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

export default function LatestRecipes() {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/search.php?f=a"
        );
        const data = await response.json();
        if (data && data.meals) {
          setRecipes(data.meals);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleRecipePress = (recipeId) => {
    // Navigate to DetailsScreen and pass recipeId as a parameter
    navigation.navigate("Details", { recipeId });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {recipes.map((recipe, index) => (
        <TouchableOpacity
          key={index}
          style={{ marginBottom: 20, alignItems: "center" }}
          onPress={() => handleRecipePress(recipe.idMeal)}
        >
          <View style={{ borderWidth: 1, borderColor: "#888" }}>
            <Image
              source={{ uri: recipe.strMealThumb }}
              style={{ width: hp(15), height: hp(15), borderRadius: hp(1) }}
            />
          </View>
          <Text style={{ fontSize: hp(2), fontWeight: "bold", marginTop: 10 }}>
            {recipe.strMeal}
          </Text>
          <Text style={{ fontSize: hp(1.5), marginTop: 5 }}>
            Category: {recipe.strCategory}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
