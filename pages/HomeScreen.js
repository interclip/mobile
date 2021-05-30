// React, React Native imports

import React, { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  Text,
  useColorScheme,
  View,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

// Components, Expo and RN libraries

import { StatusBar } from "expo-status-bar";
import Clipboard from "expo-clipboard";

import { Input } from "react-native-elements";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "@react-navigation/native";

// Functional packages

import fetch from "node-fetch";

// Local functions, components and variables

import { validationMsg, checkError } from "../lib/functions";
import { styles } from "../lib/Pages";
import { config, colors } from "../lib/Vars";

import LogoImage from "../components/LogoImage";

// Root component

export function HomeScreen({ navigation }) {
  // Variable set
  const [isLoading, setLoading] = useState(true); // Loading status => only show the responce of the API

  // After the request completes
  const [data, setData] = useState(""); // Dynamically loaded data from the Interclip REST API
  const [text, setText] = useState(""); // The code entered in the <Input>

  const colorScheme = useColorScheme();

  useFocusEffect(() => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        navigation.navigate("Offline");
      }
    });
  });

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        navigation.navigate("Offline");
      }
    });

    if (text.length === config.codeLength) {
      setText(text.replace(" ", "").toLowerCase());
      fetch(`https://interclip.app/includes/get-api?code=${text}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            if (response.status === 429) {
              Alert.alert(
                "Slow down!",
                "We are getting too many requests from you."
              );
            } else {
              Alert.alert("Error!", `Got the error ${response.status}.`);
            }
          }
        })
        .then((json) => setData(json))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [text]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === "dark" ? colors.darkContent : colors.lightContent,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ zIndex: -5, elevation: -5, marginTop: "30%" }}>
          <LogoImage />
          <Input
            keyboardType={
              Platform.OS === "android" ? "email-address" : "ascii-capable"
            }
            style={{
              ...styles.container,
              color: colorScheme === "dark" ? "white" : "black",
            }}
            placeholder="Your code here"
            maxLength={config.codeLength}
            inputStyle={{ fontSize: 50 }}
            autoCorrect={false}
            returnKeyType={"go"}
            onChangeText={(text) => setText(text)}
            defaultValue={text}
            errorStyle={{ color: "red" }}
            autoCapitalize="none"
            value={text.replace(" ", "").toLowerCase()}
            enablesReturnKeyAutomatically={true}
            onSubmitEditing={() => {
              !isLoading
                ? Linking.openURL(data.result)
                : Alert.alert(
                    `No URL set yet, make sure your code is ${config.codeLength} characters long!`
                  );
            }}
          />
          {validationMsg(text) && (
            <View style={{ padding: 24 }}>
              <Text
                style={{
                  color: colorScheme === "dark" ? colors.light : colors.text,
                }}
              >
                {validationMsg(text)}
              </Text>
            </View>
          )}
          <View style={{ padding: 24 }}>
            {!isLoading && (
              <Text
                onLongPress={() => {
                  // Handle functionality, when user presses for a longer period of time
                  try {
                    Clipboard.setString(data.result);
                    Alert.alert("Success", "Copied to Clipboard!");
                  } catch (e) {
                    Alert.alert("Error", "Couldn't copy to clipboard!");
                  }
                }}
                onPress={() => {
                  Linking.openURL(data.result);
                }}
                style={{
                  color: checkError(data.status)
                    ? colors.light
                    : colorScheme === "dark"
                    ? colors.light
                    : colors.text,
                  backgroundColor:
                    checkError(data.status) & !validationMsg(text)
                      ? colors.errorColor
                      : null,
                  fontSize: 20,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {!validationMsg(text) &&
                  (checkError(data.status)
                    ? "This code doesn't seem to exist 🤔"
                    : data.result)}
              </Text>
            )}
          </View>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
