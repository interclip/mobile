// React, React Native imports

import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Text,
  TouchableHighlight,
  useColorScheme,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

// Components, Expo and RN libraries

import { StatusBar } from "expo-status-bar";
import QRCode from "react-native-qrcode-svg";
import { Icon, Input } from "react-native-elements";
import Clipboard from "expo-clipboard";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

// Functional packages

import fetch from "node-fetch";
import isURL from "validator/lib/isURL";

// Local functions, components and variables

import { styles, urlValidation, colors, checkError } from "../lib/Pages";
import LogoImage from "../components/LogoImage";

// Root component

export function SendScreen() {
  // Variable set
  const [isLoading, setLoading] = useState(true); // Loading status => only show the responce of the API

  // after the request completes
  const [data, setData] = useState(""); // Dynamically loaded data from the Interclip REST API
  const [text, setText] = useState(""); // The code entered in the <Input>
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme();

  const pasteFromClipboard = async () => {
    const pasteboard = await Clipboard.getStringAsync();
    if (isURL(pasteboard)) {
      setText(pasteboard);
    }
  };
  useEffect(() => {
    (async () => {
      pasteFromClipboard();
    })();
  }, []);

  useEffect(() => {
    setText(text.replace(" ", "").toLowerCase());
    if (text && isURL(text, { require_protocol: true })) {
      fetch(`https://interclip.app/includes/api?url=${text}`)
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

      setLoading(true);
    }
  }, [text]);
  return (
    <View
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.darkContent : colors.lightContent,
        color: colorScheme === "dark" ? "#ffffff" : "#000000",
        flex: 1,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            marginTop: "30%",
          }}
        >
          <LogoImage />
          <Input
            keyboardType={Platform.OS === "android" ? "default" : "url"}
            style={{
              ...styles.container,
              color: colorScheme === "dark" ? "white" : "black",
            }}
            placeholder="Your URL here"
            inputStyle={{ fontSize: 25 }}
            autoCorrect={false}
            autoCompleteType={"off"}
            returnKeyType={Platform.OS === "android" ? "none" : "done"}
            onChangeText={(text) => setText(text)}
            defaultValue={text}
            errorStyle={{ color: "red" }}
            autoCapitalize="none"
            enablesReturnKeyAutomatically={true}
            onSubmitEditing={() => {
              Keyboard.dismiss;
            }}
          />
          {urlValidation(text) && (
            <View style={{ padding: 24 }}>
              <Text
                style={{
                  color: colorScheme === "dark" ? colors.light : colors.text,
                }}
              >
                {urlValidation(text)}
              </Text>
            </View>
          )}
          <View style={{ padding: 24, flexDirection: "row" }}>
            {isLoading ? (
              <Text></Text>
            ) : (
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
                style={{
                  color: colorScheme === "dark" ? colors.light : colors.text,
                  backgroundColor:
                    checkError(data.status) & !urlValidation(text)
                      ? colors.errorColor
                      : null,
                  fontSize: 40,
                  marginLeft: "20%",
                }}
              >
                {!urlValidation(text) && data.result}
              </Text>
            )}

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }}
            >
              <View
                style={{
                  ...styles.centeredView,
                  backgroundColor: colorScheme === "dark" ? "#444" : "#fff",
                }}
              >
                <View>
                  <QRCode
                    value={`https://interclip.app/${data.result}`}
                    size={250}
                    logo={require("../assets/icon.png")}
                    logoSize={60}
                    logoBackgroundColor="white"
                  />
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                      deactivateKeepAwake();
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>Hide QR Code</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
            {isURL(text, { require_protocol: true }) && (
              <Icon
                type="ionicon" // The icon is loaded from the ionicons icon library
                name="qr-code-outline"
                color={colorScheme === "dark" ? "white" : "black"} // White color for contrast on the Header
                style={{ marginLeft: 15 }}
                onPress={() => {
                  setModalVisible(true);
                  activateKeepAwake();
                }}
                size={50}
              />
            )}
          </View>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
