import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, TextInput, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import HttpService from './HttpService';
import { API_HOST } from "@env";
import { useAuth } from './AuthProvider';
import { Utils } from './Utils';


const ViewComments = ({ route }) => {
  const { recipeId } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { token, userId } = getAuthData();
  const [comment, setComment] = useState('');
  const { getTimeDifference } = Utils();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const httpService = new HttpService();
        const response = await httpService.get(`${API_HOST}/api/${userId}/recipes/${recipeId}`, token);
        console.log(response.comments);
        setComments(response.comments);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchComments();
  }, [isFocused]);

  const handleCreatorPress = (creatorId) => {
    if (creatorId === userId) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('ViewChefsProfile', { chefId: creatorId });
    }
  };
  
  if (error) {
    return <Text>Error fetching comments: {error}</Text>;
  }

  const handleCommentSubmit = async () => {
    try {
      const httpService = new HttpService();
      const response = await httpService.post(`${API_HOST}/api/recipes/${recipeId}/comments`, data, token);
      setComments(response.data.comments);

    } catch (error) {
      setError(error.message);
    }
  };
  const data = {
    content: comment
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Comments</Text>
      <View style={styles.line} />

      {comments.map(comment => (
        <View key={comment.id} style={styles.commentContainer} >
          <TouchableOpacity style={styles.commentContentContainer} onPress={() => handleCreatorPress(comment.user.id)}>
            <Image
              style={styles.creatorImage}
              source={{ uri: `${API_HOST}/storage/${comment.user.images.image}` }}
            />
            <Text style={styles.commentAuthor}>{comment.user.name}</Text>
          </TouchableOpacity>
          <Text style={styles.commentText}>{comment.content}</Text>
          <Text style={styles.createdAt}>{getTimeDifference(comment.created_at)}</Text>
        </View>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Enter your comment"
        value={comment}
        onChangeText={text => setComment(text)}
      />
      <Button
        title="Submit Comment"
        onPress={handleCommentSubmit}
        color="#5B4444"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  commentContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  commentContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  creatorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  commentText: {
    fontSize: 16,
    marginBottom: 10,
  },
  createdAt: {
    fontSize: 12,
    color: 'gray',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});

export default ViewComments;
