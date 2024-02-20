import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { API_HOST } from "@env";
const BASE_URL = 'http://192.168.56.10:80/laravel';

const useRecipeFetcher = (url) => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { token } = getAuthData();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        const recipesData = await Promise.all(data.data.map(async (recipe) => {
          const imageResponse = await fetch(`${API_HOST}/images/${recipe.image_id}`);
          if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image for recipe ${recipe.id}`);
          }
          const imageData = await imageResponse.json();
          const imageUrl = `${BASE_URL}/storage/${imageData.data.image}`;

          const creatorResponse = await fetch(`${API_HOST}/users/${recipe.creator_id}`);
          if (!creatorResponse.ok) {
            throw new Error(`Failed to fetch creator for recipe ${recipe.id}`);
          }
          const userData = await creatorResponse.json();
          const creatorImageResponse = await fetch(`${API_HOST}/images/${userData.data.image_id}`);
          if (!creatorImageResponse.ok) {
            throw new Error(`Failed to fetch image for creator ${userData.data.name}`);
          }
          const creatorImageData = await creatorImageResponse.json();
          const creatorImageUrl = `${BASE_URL}/storage/${creatorImageData.data.image}`;

          return {
            ...recipe,
            imageUrl,
            creator: {
              name: userData.data.name,
              imageUrl: creatorImageUrl,
            },
          };
        }));
        setRecipes(recipesData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRecipes();
  }, [url, token]);

  return { recipes, setRecipes, error };
};

export default useRecipeFetcher;
