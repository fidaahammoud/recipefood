import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function Chefs() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
        );
        const data = await response.json();
        if (data && data.meals) {
          setCategories(data.meals);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
        }}
      >
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={{ marginRight: 15 }}>
            <View style={{
              borderWidth: 1,
              borderColor: "#888",
              borderRadius: hp(4), // For a circular shape, use half of the width and height
              overflow: "hidden", // Clip child elements to the rounded shape
            }}>
              <Image
                source={{
                  uri: `https://www.themealdb.com/images/category/${category.strCategory}.png`,
                }}
                style={{
                  width: hp(8),
                  height: hp(8),
                  borderRadius: hp(4), // Match the parent's border-radius to ensure a perfect circle
                }}
              />
            </View>
            <Text
              style={{
                fontSize: hp(1.6),
                marginTop: 5,
                textAlign: "center",
              }}
            >
              {category.strCategory}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
