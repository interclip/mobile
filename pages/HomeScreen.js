/* React, React Native imports */

import React, { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert
} from "react-native";

/* Components, Expo and RN libraries */

import { StatusBar } from "expo-status-bar";
import Clipboard from 'expo-clipboard';
import { Header, Icon, Input } from "react-native-elements";

/* Functional packages */

import fetch from 'node-fetch';

import {
  config,
  colors,
  styles,
  validationMsg,
  checkError,
} from "../Pages";

import LogoImage from "../components/LogoImage";

import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "@react-navigation/native";

import MenuItem from '../components/MenuItem';

/* Root component */

export function HomeScreen({ navigation }) {
  /* Variable set */
  const [isLoading, setLoading] = useState(true); // Loading status => only show the responce of the API

  // after the request completes
  const [data, setData] = useState(""); // Dynamically loaded data from the Interclip REST API
  const [text, setText] = useState(""); // The code entered in the <Input>

  const [popoverOpened, setPopoverOpened] = useState(false);

  // const [progress, setProgress] = useState("");
  const colorScheme = useColorScheme();


  useFocusEffect(() => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        navigation.navigate("Offline");
      }
    });
  });

  useEffect(() => {    

    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        navigation.navigate("Offline");
      }
    });    

    if (text.length === config.codeMaxLength) {
      setText(text.replace(" ", "").toLowerCase());
      fetch(`https://interclip.app/includes/get-api?code=${text}`)
        .then((response) => {
          if(response.status === 429) {
            Alert.alert("Slow down!", "We are getting too many requests from you.");
          }
          return response.json();
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
        backgroundColor: colorScheme === "dark" ? colors.darkContent : colors.lightContent,
      }}
    >
      <Header
        containerStyle={{
          // backgroundColor: colors.headerBg,
          backgroundColor:
            colorScheme === "dark" ? colors.darkHeader : colors.lightHeader,
          color: colorScheme === "dark" ? "white" : "black",
          justifyContent: "space-around",
          marginBottom: Platform.OS === "ios" ? "20%" : "5%",
        }}
      >
        <Icon
          onPress={() => navigation.navigate("QR")}
          type="font-awesome" // The icon is loaded from the font awesome icon library
          name="qrcode" // Icon fa-qrcode
          color={colorScheme === "dark" ? "white" : "black"} // White color for contrast on the Header
        />
        <View>
          <Text
            style={{
              fontSize: 30,
              color: colorScheme === "dark" ? "white" : "black",
            }}
          >

          </Text>
        </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {setPopoverOpened(!popoverOpened);}}
            >
            <Icon
              name='menu'
              type='feather'
              color={colorScheme === "dark" ? "white" : "black"} // White color for contrast on the Header
            />
            { popoverOpened &&
            <View
              activeOpacity={0.5}
              style={{
                position: "absolute",
                right: "0%",
                marginTop: "70%",
                elevation: 3
              }}
            >
              <MenuItem navigation={navigation} colorScheme={colorScheme} setPopoverOpened={setPopoverOpened} destination={"Send"} iconName={"send"} iconFamily={"feather"} title={"Send"} />
              <MenuItem navigation={navigation} colorScheme={colorScheme} setPopoverOpened={setPopoverOpened} destination={"QR"} iconName={"qrcode"} iconFamily={"font-awesome"} title={"Scan"} />
              {Platform.OS === "ios" && (
              <MenuItem navigation={navigation} colorScheme={colorScheme} setPopoverOpened={setPopoverOpened} destination={"Settings"} iconName={"settings"} iconFamily={"feather"} title={"Settings"} />
              )}
              <MenuItem navigation={navigation} colorScheme={colorScheme} setPopoverOpened={setPopoverOpened} destination={"About"} iconName={"info"} iconFamily={"feather"} title={"About"} />
            </View>
            }
          </TouchableOpacity>
      </Header>
      <View style={{zIndex: -5, elevation: -5}}>
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
          maxLength={config.codeMaxLength}
          inputStyle={{ fontSize: 50 }}
          autoCorrect={false}
          returnKeyType={"go"}
          onChangeText={(text) => setText(text)}
          defaultValue={text}
          errorStyle={{ color: "red" }}
          autoCapitalize="none"
          autoFocus={true}
          value={text.replace(" ", "").toLowerCase()}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={() => {
            !isLoading
              ? Linking.openURL(data.result)
              : Alert.alert(
                  `No URL set yet, make sure your code is ${config.codeMaxLength} characters long!`
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
                /* Handle functionality, when user presses for a longer period of time */
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
                  ? "white"
                  : colors.text,
                backgroundColor:
                  checkError(data.status) & !validationMsg(text)
                    ? colors.errorColor
                    : null,
                fontSize: 20,
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
    </View>
  );
}
