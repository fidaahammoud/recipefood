import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image , TouchableOpacity,Button, TextInput, ScrollView} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import HttpService from './HttpService';
import { API_HOST } from "@env";
import { useAuth } from './AuthProvider';
const BASE_URL = 'http://192.168.56.10:80/laravel';
import { Utils } from './Utils'; 

const ViewComments = ({ route }) => {
  const { recipeId } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthData } = useAuth();
  const { token ,userId} = getAuthData();
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
    <ScrollView>
    <View style={styles.container}>
        <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
    </View>
      <Text style={styles.title}>Comments </Text>
      <View style={styles.line} />

      {comments.map(comment => (
        <View key={comment.id} style={styles.commentContainer}>
          <Image
            style={styles.creatorImage}
            source={{ uri: `${API_HOST}/storage/${comment.user.images.image}` }}
          />
          <Text style={styles.comment}>{comment.content}</Text>
          <Text style={styles.commentAuthor}>- {comment.user.name}</Text>
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
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  commentContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10,
  },
  comment: {
    fontSize: 16,
    marginLeft: 10, 
  },
  commentAuthor: {
    fontStyle: 'italic',
    color: 'gray',
    marginLeft: 10, 
  },
  creatorImage: {
    width: 30,
    height: 30,
    borderRadius: 15, 
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 100,
    paddingHorizontal: 10,
    borderRadius: 8, 
  },
   createdAt: {
    fontSize: 12,
    color: 'gray',
    marginTop: 30,
  },
});

export default ViewComments;
