import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import { API_HOST } from "@env";
import ImagePickerComponent from '../components/ImageHandling';
import HttpService from '../components/HttpService';

const RecipeForm = () => {
  const navigation = useNavigation();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState(['']); 
  const [ingredients, setIngredients] = useState(['']);
  const [measurementUnits, setMeasurementUnits] = useState(['']);
  const [preparationTime, setPreparationTime] = useState('');
  const [comments, setComments] = useState('');
  const [recipeId, setRecipeId] = useState('');
  const [imageId, setImageId] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [items, setItems] = useState([]);
  const httpService = new HttpService();


  const [dietaryOptions, setDietaryOptions] = useState([]);
  const [selectedDietary, setSelectedDietary] = useState(null);
  const [openDietaryModal, setOpenDietaryModal] = useState(false);
  
// Fetch dietary options on component mount
useEffect(() => {
  fetchDietaryOptions();
}, []);

// Function to fetch dietary options
const fetchDietaryOptions = async () => {
  try {
    const response = await httpService.get(`${API_HOST}/dietaries`,null);
    const data = response;
    if (data) {
      setDietaryOptions(data.map(item => ({ label: item.name, value: item.id })));
    }
  } catch (error) {
    console.error('Error fetching dietary options:', error);
  }
};

// Function to handle dietary change
const handleDietaryChange = (item) => {
  setSelectedDietary(item.value);
  setOpenDietaryModal(false);
};

  

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const response = await httpService.get(`${API_HOST}/categories`, null);
      const data = response.data; 

      if (data) {
        setItems(data.map(item => ({ label: item.name, value: item.id })));
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const handleCategoryChange = (item) => {
    setSelectedValue(item.value);
    setOpen(false); 
  };

  useEffect(() => {
    validateForm();
  }, [imageId]);

  useEffect(() => {
    validateForm();
  }, [ingredients, measurementUnits]);

  const validateForm = () => {
    if (
      title.trim() !== '' &&
      description.trim() !== '' &&
      imageId.toString().trim() !== '' &&
      selectedValue.toString().trim() !== '' &&
      selectedDietary.toString().trim() !== '' &&
      ingredients.every(ingredient => ingredient.trim() !== '') && 
      measurementUnits.every(unit => unit.trim() !== '') && 
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
      const apiUrl = `${API_HOST}/image/${userId}/recipe`;
      
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        name: 'profile_image.jpg',
        type: 'image/jpg',
      });

      const resp = await httpService.uploadImage(apiUrl, formData, token);
      setImageId(resp.id);
    } catch (error) {
      console.error('Error during image upload:', error);
    }
  };

  const handleSave = async () => {
      if (isFormValid) {
        const recipeData = {
          title,
          description,
          category_id: selectedValue,
          dietary_id: selectedDietary,
          preparationTime: parseInt(preparationTime),
          comment: comments,
          ingredients: ingredients.map((ingredient, index) => ({ ingredientName: ingredient, measurementUnit: measurementUnits[index] })),
          preparationSteps: steps,
          image_id: imageId
        };

        try {
          console.log(recipeData);

          const response = await httpService.post(`${API_HOST}/recipes`,recipeData,token);
          const newRecipeId = response.id;
          setRecipeId(newRecipeId);     
          navigation.navigate('Home');
        } 
        catch (error) {
          setError(error);
        }
      }
  };

  const handleCancel = () => {
    navigation.navigate('Home');
  };

  const handleIngredientChange = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };

  const handleMeasurementUnitChange = (text, index) => {
    const newMeasurementUnits = [...measurementUnits];
    newMeasurementUnits[index] = text;
    setMeasurementUnits(newMeasurementUnits);
  };

  const handleStepChange = (text, index) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
    setMeasurementUnits([...measurementUnits, '']);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);

    const newMeasurementUnits = [...measurementUnits];
    newMeasurementUnits.splice(index, 1);

    setIngredients(newIngredients);
    setMeasurementUnits(newMeasurementUnits);
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
      <TouchableOpacity style={styles.dropdownContainer} onPress={() => setOpen(true)}>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.dropdownValue}>{selectedValue ? items.find(item => item.value === selectedValue)?.label : 'Click to select a category'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dropdownContainer} onPress={() => setOpenDietaryModal(true)}>
        <Text style={styles.label}>Dietary:</Text>
        <Text style={styles.dropdownValue}>{selectedDietary ? dietaryOptions.find(item => item.value === selectedDietary)?.label : 'Click to select a dietary option'}</Text>
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

      <View>
        <Text style={styles.label}>Ingredients:</Text>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientRow}>
            <TextInput
              value={ingredient}
              onChangeText={(text) => handleIngredientChange(text, index)}
              style={[styles.input, styles.ingredientInput]}
              placeholder="Enter ingredient"
            />
            <TextInput
              value={measurementUnits[index]}
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
      </View>
      <Text style={styles.label}>Preparation Time:</Text>
      <TextInput
        value={preparationTime}
        onChangeText={setPreparationTime}
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
        <ImagePickerComponent setImage={setImage} saveImageToDatabase={saveImageToDatabase} buttonTitle="Add a Recipe Photo"/>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={handleCancel} color="#FF0000" />
        <Button title="Submit" onPress={handleSave} disabled={!isFormValid} color="#5B4444" />
      </View>
      <Modal
        visible={open}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                {items.map(item => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.dropdownItem}
                    onPress={() => handleCategoryChange(item)}>
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={openDietaryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOpenDietaryModal(false)}>
        <TouchableWithoutFeedback onPress={() => setOpenDietaryModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                {dietaryOptions.map(item => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.dropdownItem}
                    onPress={() => handleDietaryChange(item)}>
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
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
  imagePicker: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default RecipeForm;
