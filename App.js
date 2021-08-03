// 1st party libraries and dependencies: react, react native and Expo stuff

import React from "react";
import { useColorScheme, Platform, Text } from "react-native";

// 3rd party libraries

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { Icon } from "react-native-elements";
import Toast from "react-native-toast-message";
import * as Linking from "expo-linking";

// Pages

import { SendScreen } from "./pages/SendScreen";
import { QRScreen } from "./pages/QRScreen";
import { HomeScreen } from "./pages/HomeScreen";
import { SettingsPage, QRSettings, FileSettings } from "./pages/SettingsPage";
import { AboutPage } from "./pages/AboutPage";
import { FilePage } from "./pages/FilePage";
import { OfflinePage } from "./pages/OfflinePage";

// Constants

import { colors } from "./lib/Vars";

// App component
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomePages() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator
      screenOptions={({ route }) => {
        return {
          headerShown: route.name !== "Receive a clip",
          headerStyle: {
            backgroundColor:
              colorScheme === "dark" ? colors.darkHeader : colors.light,
          },
          headerTitleStyle: {
            color: colorScheme === "dark" ? "white" : "black",
          },
        };
      }}
    >
      <Stack.Screen name="Receive a clip" component={HomeScreen} />
      <Stack.Screen name="Offline" component={OfflinePage} />
    </Stack.Navigator>
  );
}

function Settings() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator
      screenOptions={({ route }) => {
        return {
          headerShown: route.name !== "Settings",
          headerMode: "float",
          headerStyle: {
            backgroundColor:
              colorScheme === "dark" ? colors.darkHeader : colors.light,
          },
          headerTitleStyle: {
            color: colorScheme === "dark" ? "white" : "black",
          },
        };
      }}
    >
      <Stack.Screen
        headerShown={false}
        name="Settings"
        component={SettingsPage}
      />
      <Stack.Screen name="QR" component={QRSettings} />
      <Stack.Screen name="Files" component={FileSettings} />
      <Stack.Screen name="About" component={AboutPage} />
    </Stack.Navigator>
  );
}

function MyTabs() {
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
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
        name="HomePages"
        component={HomePages}
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
            <Icon
              name="qr-code-outline"
              type="ionicon"
              color={color}
              size={size}
            />
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
            <Icon
              name="image-outline"
              type="ionicon"
              color={color}
              size={size}
            />
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
              <Icon
                name="cog-outline"
                type="ionicon"
                color={color}
                size={size}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default function App() {

  const config = {
    screens: {
      Scan: 'feed/:sort',
      SettingsPage: 'user',
    },
  };

  const prefix = Linking.createURL("/");

  const linking = {
    prefixes: ["https://interclip.app/", prefix],
    config,
  };
  const { state } = useLinking(linking);
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <MyTabs />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}
