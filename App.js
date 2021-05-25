// 1st party libraries and dependencies: react, react native and Expo stuff

import React from "react";
import { useColorScheme } from "react-native";

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
import { OfflinePage } from "./pages/OfflinePage";
import { FilePage } from "./pages/FilePage";

import {
  SFSymbol,
  SFSymbolWeight,
  SFSymbolScale,
} from "react-native-sfsymbols";

// Constants

import { colors } from "./lib/Vars";

// App component
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBarOptions={{
        activeTintColor: "#157EFB",
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
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutPage}
        options={{
          tabBarLabel: "About",
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
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
