import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';

export default function AuthLoadingScreen(props) {
  useEffect(() => {
    _bootstrapAsync();
  });

  _bootstrapAsync = async () => {
    const usertoken = await AsyncStorage.getItem('token');
    props.navigation.replace(usertoken ? 'Profile' : 'Login');
  };

  return (
    <View>
      <ActivityIndicator />
    </View>
  );
}
