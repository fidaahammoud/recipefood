import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { API_HOST } from "@env";
import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService'; 
import Footer from '../components/Footer';
import { FontAwesome } from '@expo/vector-icons';

const NotificationScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { getAuthData } = useAuth();
  const { userId, token, recieveNotification } = getAuthData();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const httpService = new HttpService();
      const response = await httpService.get(`${API_HOST}/api/notifications`, token);
      const updatedNotifications = response.notifications.map(notification => ({
        ...notification,
        isRead: notification.isRead
      }));
      setNotifications(updatedNotifications);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (recieveNotification) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 10000);
      return () => clearInterval(intervalId);
    }
  }, [isFocused, recieveNotification]);

  const markNotificationAsRead = async (notificationId) => {
    const httpService = new HttpService();
    const response = await httpService.put(`${API_HOST}/api/updateStatusNotification/${userId}/${notificationId}`, null, token);
    console.log(response);
    fetchNotifications();
  };

  if (error) {
    return <Text>Error fetching notifications: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.line} />

      {!recieveNotification && (
        <Text style={styles.updateStatusText} onPress={() => navigation.navigate('Settings')}>
          Update notification status
        </Text>
      )}
      <ScrollView style={styles.scrollView}>
        {notifications.map((notification, index) => (
          <TouchableOpacity
            key={notification.id}
            onPress={() => {
              markNotificationAsRead(notification.id);
            }}
          >
            <View style={[styles.notificationContainer, notification.isRead ? null:styles.notificationNotRead ]}>
              <Image source={{ uri: `${API_HOST}/storage/${notification.source_user.images.image}` }} style={styles.userImage} />
              <Text style={styles.notificationText}>
                {notification.content}
              </Text>
            </View>
            {index !== notifications.length - 1 && <View style={styles.horizontalLine} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop:20,
  },
  updateStatusText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  scrollView: {
    width: '100%',
  },
  notificationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationNotRead: {
    backgroundColor: '#ccc',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
    fontSize: 16,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
  },
  line: {
    width: '80%',
    height: 1,
    backgroundColor: 'black',
    marginBottom: 10,
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
});

export default NotificationScreen;
