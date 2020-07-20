/* 1st party libraries and dependencies: react, react native and Expo stuff */

import { StatusBar } from 'expo-status-bar';

import React, { useState, useEffect } from 'react';

/* 3rd party libraries */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/* Pages */
import { HomeScreen, QRScreen, SettingsPage } from './Pages.js';
/* App component */

const Stack = createStackNavigator();

const root = () => {
  return(
      <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="QR" component={QRScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QR" component={QRScreen} />
        <Stack.Screen name="Settings" component={SettingsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
