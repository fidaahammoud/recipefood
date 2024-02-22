import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import HttpService from './HttpService';

const BASE_URL = 'http://192.168.56.10:80/laravel';

const useRecipeFetcher = (url) => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { token } = getAuthData();

  useEffect(() => {
    const httpService = new HttpService();

    const fetchRecipes = async () => {
      try {
        const response =  await httpService.get(url, token);
        const responseData = response.data;
        const recipesData = await Promise.all(responseData.map(async (recipe) => {
          const imageUrl = `${BASE_URL}/storage/${recipe.images.image}`;
          // Fetch creator data
          const creatorData = recipe.user;
          const creatorImageUrl = `${BASE_URL}/storage/${creatorData.images.image}`;

          return {
            ...recipe,
            imageUrl,
            creator: {
              id: creatorData.id,
              name: creatorData.name,
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
