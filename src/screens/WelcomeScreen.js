import React  from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/background.jpg")}
        style={styles.backgroundImage}
      />

      <View style={styles.logoContainer}>
        <Image
          style={styles.logoImage}
          source={require("../../assets/images/logo.jpeg")}
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Yumster</Text>
        <Text style={styles.subtitleText}>Deliciously simple</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Starting")}
        >
          <Text style={styles.buttonText}>Start Cooking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f64e32",
  },
  backgroundImage: {
    position: "absolute",
    width: wp(100),
    height: hp(100),
  },
  logoContainer: {
    position: "absolute",
    top: hp(25),
    right: wp(20),
    alignItems: "flex-end",
  },
  logoImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12),
  },
  titleContainer: {
    position: "absolute",
    top: hp(40),
    right: wp(12),
    alignItems: "flex-end",
  },
  titleText: {
    color: "#5B4444",
    fontSize: hp(5),
    fontWeight: "bold",
  },
  subtitleText: {
    color: "#5B4444",
    fontSize: hp(2.5),
    fontStyle: "italic",
  },
  buttonContainer: {
    position: "absolute",
    top: hp(60),
    right: wp(10),
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "#5B4444",
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(5),
    borderRadius: hp(1.5),
  },
  buttonText: {
    color: "white",
    fontSize: hp(2.2),
    fontWeight: "medium",
  },
});
