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
import { AuthProvider } from '../components/AuthProvider';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen'; 
import RcipeCommentScreen from '../screens/RcipeCommentScreen'; 

import ProfileScreen from '../screens/ProfileScreen'; 
import EditProfileScreen from '../screens/EditProfileScreen'; 
import ViewAllChefsScreen from '../screens/ViewAllChefsScreen'; 
import ViewAllCategoriesScreen from '../screens/ViewAllCategoriesScreen'; 

import ChefsProfileDetailsScreen from '../screens/ChefsProfileDetailsScreen'; 
import RecipesForSpecificCategoryScreen from '../screens/RecipesForSpecificCategoryScreen'; 
import EditRecipeScreen from '../screens/EditRecipeScreen'; 



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
                <Stack.Screen name="ViewChefsProfile" component={ChefsProfileDetailsScreen} />
                <Stack.Screen name="ViewAllChefs" component={ViewAllChefsScreen} />
                <Stack.Screen name="ViewAllCategories" component={ViewAllCategoriesScreen} />
                <Stack.Screen name="RecipesOfSpecificCategory" component={RecipesForSpecificCategoryScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />
                <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
                <Stack.Screen name="RecipeComments" component={RcipeCommentScreen} />

                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="EditRecipe" component={EditRecipeScreen} />

            </Stack.Navigator>
        </NavigationContainer>  
        </AuthProvider>
        
    );
  }