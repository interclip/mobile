// 1st party libraries and dependencies: react, react native and Expo stuff

import React from "react";
import { useColorScheme, Platform } from "react-native";

// 3rd party libraries

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Icon } from "react-native-elements";

// Pages

import { SendScreen } from "./pages/SendScreen";
import { QRScreen } from "./pages/QRScreen";
import { HomeScreen } from "./pages/HomeScreen";
import { SettingsPage, QRSettings } from "./pages/SettingsPage";
import { AboutPage } from "./pages/AboutPage";
import { FilePage } from "./pages/FilePage";
import { OfflinePage } from "./pages/OfflinePage";

// Constants

import { colors } from "./lib/Vars";

// App component
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Settings() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => {
        return { headerShown: route.name !== "Settings" };
      }}
    >
      <Stack.Screen
        headerShown={false}
        name="Settings"
        component={SettingsPage}
      />
      <Stack.Screen name="QR" component={QRSettings} />
      <Stack.Screen name="About" component={AboutPage} />
    </Stack.Navigator>
  );
}

function MyTabs() {
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
      showLabel={false}
      initialRouteName="Home"
      tabBarOptions={{
        showLabel: false,
        activeTintColor: "#157EFB",
        inactiveTintColor: colorScheme === "dark" ? colors.light : colors.text,
        style: {
          backgroundColor:
            colorScheme === "dark" ? colors.headerBg : colors.lightContent,
          color: colorScheme === "dark" ? colors.light : colors.text,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Receive",
          tabBarIcon: ({ color, size }) => (
            <Icon name="download" type="feather" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={QRScreen}
        options={{
          tabBarLabel: "Scan",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="qrcode" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Send"
        component={SendScreen}
        options={{
          tabBarLabel: "Create",
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-circle" type="feather" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="File"
        component={FilePage}
        options={{
          tabBarLabel: "File",
          tabBarIcon: ({ color, size }) => (
            <Icon name="image" type="feather" color={color} size={size} />
          ),
        }}
      />
      {Platform.OS === "ios" && (
        <Tab.Screen
          name="SettingsPage"
          component={Settings}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
