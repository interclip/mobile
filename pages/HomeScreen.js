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
  ActivityIndicator,
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

import { validationMsg, checkError, truncate } from "../lib/functions";
import { styles } from "../lib/Pages";
import { config, colors, inputProps } from "../lib/Vars";

import LogoImage from "../components/LogoImage";

// Root component

export function HomeScreen({ navigation }) {
  // Variable set
  const [isLoading, setLoading] = useState(false); // Loading status => only show the responce of the API

  // After the request completes
  const [data, setData] = useState(""); // Dynamically loaded data from the Interclip REST API
  const [statusCode, setStatusCode] = useState(200);
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
      setLoading(true);
      fetch(`https://interclip.app/includes/get-api?code=${text}`)
        .then((response) => {
          if (response.ok) {
            setStatusCode(200);
            return response.json();
          } else {
            if (response.status === 429) {
              Alert.alert(
                "Slow down!",
                "We are getting too many requests from you."
              );
              return {};
            } else {
              if (config.exemptStatusCodes.includes(response.status)) {
                setStatusCode(response.status);
                return response.json();
              } else {
                setStatusCode(400);
                Alert.alert("Error!", `Got the error ${response.status}.`);
                return response.json();
              }
            }
          }
        })
        .then((json) => setData(json))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
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
            {...inputProps}
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
            onChangeText={(text) => setText(text)}
            defaultValue={text}
            value={text.replace(" ", "").toLowerCase()}
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
            {!isLoading ? (
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
                  (statusCode === 404
                    ? "This code doesn't seem to exist 🤔"
                    : statusCode === 400
                    ? "Something went wrong..."
                    : truncate(data?.result ? data.result : "", 80))}
              </Text>
            ) : (
              <ActivityIndicator />
            )}
          </View>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
