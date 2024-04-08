import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import { API_HOST } from "@env";
import ImagePickerComponent from '../components/ImageHandling';
import HttpService from '../components/HttpService';

const EditRecipeForm = () => {
  const httpService = new HttpService();

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState(['']); 
  const [ingredients, setIngredients] = useState([{ name: '', measurementUnit: '' }]);
  const [preparationTime, setPreparationTime] = useState('');
  const [comments, setComments] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageId, setImageId] = useState('');
  const [image, setImage] = useState(null);

  const [isFormValid, setIsFormValid] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); 
  const [loading, setLoading] = useState(false);

  const [imageUri, setImageUri] = useState(null); 
  

  useEffect(() => {
    fetchRecipeDetails();
    fetchDropdownOptions();
  }, [isFocused]);

  const fetchRecipeDetails = async () => {
    const recipeId = route.params.recipeId; 
    try {
      const response = await httpService.get(`${API_HOST}/api/recipes/${recipeId}`, token);
      const recipeData = response; 
    
      setTitle(recipeData.title);
      setDescription(recipeData.description);
      setSteps(recipeData.steps.map(step => step.stepDescription));
      setIngredients(recipeData.ingredients.map(ingredient => ({ name: ingredient.ingredientName, measurementUnit: ingredient.measurementUnit })));
      setPreparationTime(recipeData.preparationTime.toString());
      setComments(recipeData.comment);
      setSelectedCategory(recipeData.category_id.toString());
      setImageId(recipeData.image_id.toString());
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const response = await httpService.get(`${API_HOST}/api/categories`, null);
      const data = response.data; 

      if (data) {
        setCategories(data.map(item => ({ label: item.name, value: item.id.toString() })));
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  useEffect(() => {
    validateForm();
    
  }, [imageId,image,isFocused]);

  const validateForm = () => {
    if (
      title.trim() !== '' &&
      description.trim() !== '' &&
      imageId.toString().trim() !== '' &&
      selectedCategory !== null &&
      ingredients.every(ingredient => ingredient.name.trim() !== '' && ingredient.measurementUnit.trim() !== '') && 
      steps.every(step => step.trim() !== '') && 
      preparationTime.trim() !== '' 
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const saveImageToDatabase = async (selectedImage) => {
    try {
      const apiUrl = `${API_HOST}/api/image/${userId}`;
      
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        name: 'profile_image.jpg',
        type: 'image/jpg',
      });

      const resp = await httpService.uploadImage(apiUrl, formData, token);
      console.log("new image id "+ resp.id);
      setImageId(resp.id);
      setImageUri(selectedImage.uri); 
    } catch (error) {
      console.error('Error during image upload:', error);
      setImageUri(null); 

    }
  };

  const handleSave = async () => {
    if (isFormValid) {

    const recipeData = {
      title,
      description,
      category_id: selectedCategory,
      preparationTime: parseInt(preparationTime),
      comment: comments,
      ingredients: ingredients.map(ingredient => ({ 
        ingredientName: ingredient.name, 
        measurementUnit: ingredient.measurementUnit 
      })),
      preparationSteps: steps,
      image_id: imageId
    };
  
    try {
      const response = await httpService.put(`${API_HOST}/api/recipes/${route.params.recipeId}`, recipeData, token);
      console.log(response);
      navigation.navigate('Home');
    } catch (error) {
      setError(error);
    }
  }
  };
  
  const handleCancel = () => {
    navigation.navigate('Home');
  };

  const handleIngredientChange = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index].name = text;
    setIngredients(newIngredients);
  };
  
  const handleStepChange = (text, index) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };
  
  const handleMeasurementUnitChange = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index].measurementUnit = text;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', measurementUnit: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        onBlur={validateForm}
        style={styles.input}
        placeholder="Enter title"
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        onBlur={validateForm}
        style={styles.input}
        placeholder="Enter description"
      />
      <Text style={styles.label}>Category:</Text>
      <TouchableOpacity style={styles.dropdownContainer} onPress={() => setOpen(true)}>
        <Text style={styles.dropdownValue}>{selectedCategory ? categories.find(cat => cat.value === selectedCategory)?.label : 'Select Category'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Steps:</Text>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <TextInput
            value={step}
            onChangeText={(text) => handleStepChange(text, index)}
            style={[styles.input, styles.multiline, styles.stepInput]}
            placeholder={`Enter step ${index + 1}`}
            multiline
          />
          <TouchableOpacity onPress={() => handleRemoveStep(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>-</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={handleAddStep} style={styles.addButton}>
        <Text style={styles.buttonText}>+ Add Step</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Ingredients:</Text>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <TextInput
            value={ingredient.name}
            onChangeText={(text) => handleIngredientChange(text, index)}
            style={[styles.input, styles.ingredientInput]}
            placeholder={`Enter ingredient ${index + 1}`}
          />
          <TextInput
            value={ingredient.measurementUnit}
            onChangeText={(text) => handleMeasurementUnitChange(text, index)}
            style={[styles.input, styles.measurementInput]}
            placeholder="Unit"
          />
          <TouchableOpacity onPress={() => handleRemoveIngredient(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>-</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={handleAddIngredient} style={styles.addButton}>
        <Text style={styles.buttonText}>+ Add Ingredient</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Preparation Time:</Text>
      <TextInput
        value={preparationTime}
        onChangeText={setPreparationTime}
        onBlur={validateForm}
        style={styles.input}
        placeholder="Enter preparation time"
      />
      <Text style={styles.label}>Comments:</Text>
      <TextInput
        value={comments}
        onChangeText={setComments}
        style={[styles.input, styles.multiline]}
        placeholder="Enter comments"
        multiline
      />
    <View style={styles.imagePicker}>
        <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase}   buttonTitle="Update Your Recipe Photo"/>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={handleCancel}  color="#888"/>
        <Button title="Submit" onPress={handleSave} disabled={!isFormValid} color="#5B4444" />
      </View>

      {/* Modal for category selection */}
      <Modal
        visible={open}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCategory(category.value);
                    setOpen(false);
                  }}>
                  <Text>{category.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownValue: {
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: 200,
    width: '80%',
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepInput: {
    flex: 1,
    marginRight: 5,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientInput: {
    flex: 1,
    marginRight: 5,
  },
  measurementInput: {
    width: 100,
  },
  removeButton: {
    backgroundColor: '#5B4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#5B4444',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:20
  },
});

export default EditRecipeForm;
