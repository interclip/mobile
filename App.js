// 1st party libraries and dependencies: react, react native and Expo stuff

import React from "react";
import { useColorScheme, Platform } from "react-native";

// 3rd party libraries

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Icon } from "react-native-elements";

// Pages

import { SendScreen } from "./pages/SendScreen";
import { QRScreen } from "./pages/QRScreen";
import { HomeScreen } from "./pages/HomeScreen";
import { SettingsPage } from "./pages/SettingsPage";
import { AboutPage } from "./pages/AboutPage";
import { FilePage } from "./pages/FilePage";

// Constants

import { colors } from "./lib/Vars";

// App component
const Tab = createBottomTabNavigator();

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
      {Platform.OS === "ios" && 
        <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          tabBarLabel: "Settings",
          showLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
      }

      <Tab.Screen
        name="About"
        component={AboutPage}
        options={{
          tabBarLabel: "About",
          showLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="information"
              color={color}
              size={size}
            />
          ),
        }}
      />
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
