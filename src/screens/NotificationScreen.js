import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import { API_HOST } from "@env";
import { useAuth } from '../components/AuthProvider';
import HttpService from '../components/HttpService'; 
import Footer from '../components/Footer';

const BASE_URL = 'http://192.168.56.10:80/laravel';


const NotificationScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { getAuthData } = useAuth();
  const { userId, token } = getAuthData();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Track notification read status individually
  const [seenNotifications, setSeenNotifications] = useState(new Set());

  const fetchNotifications = async () => {
    try {
      const httpService = new HttpService();
      const response = await httpService.get(`${API_HOST}/api/notifications`, token);
      const updatedNotifications = response.notifications.map(notification => ({
        ...notification,
        read: false // Assuming all notifications are initially unread
      }));
      setNotifications(updatedNotifications);

      // Load seen notifications from AsyncStorage
      const seenNotificationsStr = await AsyncStorage.getItem('seenNotifications');
      if (seenNotificationsStr) {
        const seenNotificationsArr = JSON.parse(seenNotificationsStr);
        setSeenNotifications(new Set(seenNotificationsArr));
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    setInterval(fetchNotifications, 10000);
    // Clear seen notifications when navigating away from the screen
    const unsubscribe = navigation.addListener('blur', () => {
      setSeenNotifications(new Set()); // Reset seen notifications on blur
    });

    return () => unsubscribe();
  }, [isFocused]);

  const markNotificationAsRead = async (notificationId) => {
    setSeenNotifications(new Set([...seenNotifications, notificationId])); // Mark as seen
    setNotifications(notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));

    // Save seen notifications to AsyncStorage
    await AsyncStorage.setItem('seenNotifications', JSON.stringify([...seenNotifications, notificationId]));
  };

  if (error) {
    return <Text>Error fetching notifications: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <ScrollView style={styles.scrollView}>
        {notifications.map((notification, index) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationContainer,
              { backgroundColor: seenNotifications.has(notification.id) ? '#E0E0E0' : '#FFFFFF' }
            ]}
            onPress={() => {
              markNotificationAsRead(notification.id);
            }}
          >
            <View style={styles.notificationContent}>
              <Image source={{  uri: `${API_HOST}/storage/${notification.source_user.images.image}`}} style={styles.userImage} />
              <Text
                style={[
                  styles.notificationText,
                  {
                    fontWeight: seenNotifications.has(notification.id) ? 'normal' : 'bold',
                    color: seenNotifications.has(notification.id) ? 'grey' : 'black',
                  },
                ]}
              >
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
  },
  scrollView: {
    width: '100%',
  },
  notificationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default NotificationScreen;
