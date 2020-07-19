/* 1st party libraries and dependencies: react, react native and Expo stuff */

import { StatusBar } from 'expo-status-bar';
import { BarCodeScanner } from 'expo-barcode-scanner';

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Linking,
  Clipboard,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

/* 3rd party libraries */

import { iclipUrif } from './Vars.js';
import { Header, Input, Icon } from 'react-native-elements';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/* Pages */
import { HomeScreen, QRScreen } from './Pages.js';

/* App component */

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QR" component={QRScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
