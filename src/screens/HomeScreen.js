import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Categories from "../components/Categories";
import Chefs from "../components/Chefs";
import LatestRecipes from "../components/LatestRecipes";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="dark" />
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 50,
            paddingTop: hp(1),
            alignItems: "center",
          }}
          className="space-y-6 pt-14"
        >
          {/* logo */}
          <View className="mx-4 flex-row justify-between items-center">
            <Image
              source={require("../../assets/images/logo.jpeg")}
              style={{
                width: hp(8),
                height: hp(8),
                resizeMode: "cover",
              }}
              className="rounded-full"
            />
          </View>

          {/* Sorting and Filtering */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: hp(1),
            }}
          >
            <TouchableOpacity>
              {/* Sorting */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AdjustmentsHorizontalIcon
                  size={hp(3)}
                  color={"black"}
                  strokeWidth={2}
                />
                <Text style={{ marginLeft: 5 }}>Sort</Text>
              </View>
            </TouchableOpacity>
            {/* Empty space to separate sorting and filtering icons */}
            <View style={{ width: hp(3) }} />
            <TouchableOpacity>
              {/* Filtering */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AdjustmentsHorizontalIcon
                  size={hp(3)}
                  color={"black"}
                  strokeWidth={2}
                />
                <Text style={{ marginLeft: 5 }}>Filter</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* Search Bar */}
          <View className="mx-4 flex-row items-center border rounded-xl border-black p-[6px]">
            <View className="bg-white rounded-full p-2">
              <MagnifyingGlassIcon
                size={hp(2.5)}
                color={"gray"}
                strokeWidth={3}
              />
            </View>
            <TextInput
              placeholder="Search Your Favorite Food"
              placeholderTextColor={"gray"}
              style={{
                fontSize: hp(1.7),
              }}
              className="flex-1 text-base mb-1 pl-1 tracking-widest"
            />
          </View>

          {/* Categories*/}
          <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
            <Text
              style={{
                color: "#5B4444",
                fontSize: hp(2),
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
              Categories
            </Text>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity>
                <Text
                  style={{
                    color: "#5B4444",
                    fontSize: hp(2),
                    fontStyle: "italic",
                    fontWeight: "bold",
                  }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Categories />
          </View>

          {/* Chefs*/}
          {/* <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
            <View style={{ flex: 1 }}>
              
            </View>
            <Text
              style={{
                color: "#5B4444",
                fontSize: hp(2),
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
              Chefs
            </Text>
          </View>

          <View>
            <Chefs />
          </View> */}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
