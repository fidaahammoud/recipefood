import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import ViewComments from '../components/ViewComments';
import HttpService from '../components/HttpService';
import { useAuth } from '../components/AuthProvider';
import { API_HOST } from "@env";

const RcipeCommentScreen = ({ route }) => {

  return (
    
      <View style={styles.container}>
        <ViewComments route={route} />
      </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

});

export default RcipeCommentScreen;
