import { View } from "react-native";
import React  from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import StartingScreen from "../screens/StartingScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import CompleteProfileScreen from "../screens/CompleteProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import AddRecipeScreen from '../screens/AddRecipeScreen'; 
import UploadRecipeImageScreen from '../screens/UploadRecipeImageScreen'; 
import { AuthProvider } from '../components/AuthProvider';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen'; 
import ProfileScreen from '../screens/ProfileScreen'; 
import EditProfileScreen from '../screens/EditProfileScreen'; 
import ViewAllChefsScreen from '../screens/ViewAllChefsScreen'; 

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return (
        <AuthProvider>
        <NavigationContainer>
            <Stack.Navigator 
            initialRouteName="Welcome"
            screenOptions={{
                headerShown: false,
            }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Starting" component={StartingScreen} />
                <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
                <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
                <Stack.Screen name="ViewAllChefs" component={ViewAllChefsScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />
                <Stack.Screen name="ImageUpload" component={UploadRecipeImageScreen} />
                <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>  
        </AuthProvider>
        
    );
  }