import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_HOST } from "@env";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../components/AuthProvider';

const BASE_URL = 'http://192.168.56.10:80/laravel';

const useRecipeFetcher = (url) => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { token } = getAuthData();

  useEffect(() => {
    fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        return response.json();
      })
      .then((data) => {
        const recipePromises = data.data.map((recipe) => {
          const imagePromise = fetch(`${API_HOST}/images/${recipe.image_id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch image for recipe ${recipe.id}`);
              }
              return response.json();
            })
            .then((imageData) => {
              const imageUrl = `${BASE_URL}/storage/${imageData.data.image}`;
              return imageUrl;
            });

          const creatorPromise = fetch(`${API_HOST}/users/${recipe.creator_id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch creator for recipe ${recipe.id}`);
              }
              return response.json();
            })
            .then((userData) => {
              const imageId = userData.data.image_id;
              return fetch(`${API_HOST}/images/${imageId}`)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`Failed to fetch image for creator ${userData.data.name}`);
                  }
                  return response.json();
                })
                .then((imageData) => {
                  const imageUrl = `${BASE_URL}/storage/${imageData.data.image}`;
                  const creator = {
                    name: userData.data.name,
                    imageUrl: imageUrl,
                  };
                  return creator;
                });
            });

          return Promise.all([imagePromise, creatorPromise])
            .then(([imageUrl, creator]) => {
              return {
                ...recipe,
                imageUrl: imageUrl,
                creator: creator,
              };
            });
        });
        return Promise.all(recipePromises);
      })
      .then((recipesData) => setRecipes(recipesData))
      .catch((error) => setError(error.message));
  }, [url, token]);

  return { recipes, error };
};
export default useRecipeFetcher;