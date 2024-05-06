import React, { Component } from 'react';
import { ToastAndroid } from 'react-native';

class HttpService extends Component {
  async get(url, token) {
    try {
      const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async post(url, data,token) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const responseBody = await response.json();

      if (!response.ok) {
        console.log('Response status:', response.status);
        console.log('Response body:', responseBody);
  
        if (response.status === 401 || response.status === 422) {
          ToastAndroid.show(responseBody.message, ToastAndroid.SHORT);
        } else {
          throw new Error('Network response was not ok');
        }
      }
      return responseBody;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async put(url, data, token) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const responseBody = await response.json();

      if (!response.ok) {
        console.log('Response status:', response.status);
        console.log('Response body:', responseBody);
  
        if (response.status === 422) {
          //it's not working !! status 422 here 
          console.log(responseBody.message);
          ToastAndroid.show(responseBody.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(responseBody.message, ToastAndroid.SHORT);
        }
      }
      return responseBody;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async delete(url, token) {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async uploadImage(url, data, token, retries = 3) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        console.error('Error:', error);
        console.log(`Retrying ${retries} more times...`);
        return await this.uploadImage(url, data, token, retries - 1); // Recursive call
      } else {
        throw new Error('Maximum number of retries exceeded');
      }
    }
  }

  render() {
    return null; 
  }
}

export default HttpService;
