import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function Categories() {
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
        className="space-x-4"
        contentContainerStyle={{
          paddingHorizontal: 10,
        }}
      >
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={{ marginRight: 15 }}>
            <View style={{ borderWidth: 1, borderColor: "#888" }}>
              <Image
                source={{
                  uri: `https://www.themealdb.com/images/category/${category.strCategory}.png`,
                }}
                style={{
                  width: hp(8),
                  height: hp(8),
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
