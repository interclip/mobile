/* 1st party libraries and dependencies: react, react native and Expo stuff */

/* 3rd party libraries */

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { useColorScheme } from "react-native";

/* Pages */
import { HomeScreen, QRScreen, SendScreen, SettingsPage } from "./Pages.js";

/* App component */

const Stack = createStackNavigator();

const root = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="QR" component={QRScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#333333" : "#ffffff",
          },
          headerTitleStyle: {
            color: colorScheme === "dark" ? "white" : "black",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QR"
          component={QRScreen}
          options={{ title: "Scan QR" }}
        />
        <Stack.Screen
          name="Send"
          component={SendScreen}
          options={{ title: "New clip" }}
        />
        <Stack.Screen name="Settings" component={SettingsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
