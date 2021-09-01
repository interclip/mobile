// React, React Native imports

import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Text,
  useColorScheme,
  View,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

// Components, Expo and RN libraries

import { StatusBar } from "expo-status-bar";
import QRCode from "react-native-qrcode-svg";
import { Icon, Input, Button } from "react-native-elements";
import { Notifier, NotifierComponents } from "react-native-notifier";

import * as Clipboard from "expo-clipboard";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

// Functional packages

import fetch from "node-fetch";
import isURL from "validator/lib/isURL";

// Local functions, components and variables
import { colors, inputProps } from "../lib/vars";
import { urlValidation, checkError } from "../lib/functions";
import { styles } from "../lib/pages";

import LogoImage from "../components/LogoImage";

// Root component

const SendScreen: React.FC = () => {
  // Variable set
  const [isLoading, setLoading] = useState(true); // Loading status => only show the responce of the API

  // after the request completes
  const [data, setData] = useState<{ result: string }>({ result: "" }); // Dynamically loaded data from the Interclip REST API
  const [text, setText] = useState(""); // The code entered in the <Input>
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme();
  const { width } = Dimensions.get("window");

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
      fetch(`https://interclip.app/api/set?url=${text}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            if (response.status === 429) {
              Notifier.showNotification({
                title: "We are getting too many requests from you.",
                Component: NotifierComponents.Alert,
                componentProps: {
                  alertType: "error",
                },
              });
            } else {
              Notifier.showNotification({
                title: `Got the error ${response.status}`,
                Component: NotifierComponents.Alert,
                componentProps: {
                  alertType: "error",
                },
              });
            }
          }
        })
        .then((json) => setData(json))
        .catch((error: { message: string }) => {
          Notifier.showNotification({
            title: "Error",
            description: error.message,
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: "error",
            },
          });
          setData({ result: "Something went wrong..." });
        })
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
            {...inputProps}
            keyboardType={Platform.OS === "android" ? "default" : "url"}
            style={{
              ...styles.container,
              color: colorScheme === "dark" ? "white" : "black",
            }}
            placeholder="Your URL here"
            inputStyle={{ fontSize: 25 }}
            returnKeyType={Platform.OS === "android" ? "none" : "done"}
            onChangeText={(text) => setText(text)}
            defaultValue={text}
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
                    Notifier.showNotification({
                      title: "The code has been copied to your clipboard!",
                      Component: NotifierComponents.Alert,
                      componentProps: {
                        alertType: "success",
                      },
                    });
                  } catch (e) {
                    Notifier.showNotification({
                      title: "Couldn't copy to clipboard!",
                      Component: NotifierComponents.Alert,
                      componentProps: {
                        alertType: "error",
                      },
                    });
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
                {data.result}
              </Text>
            )}

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
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
                    color={colorScheme === "dark" ? "#fff" : "#000"}
                    backgroundColor={colorScheme === "dark" ? "#444" : "white"}
                    logoBackgroundColor="white"
                  />
                  <Button
                    title="Hide QR Code"
                    buttonStyle={{
                      textAlign: "center",
                      backgroundColor:
                        colorScheme === "dark" ? "white" : "black",
                      paddingLeft: width * 0.125,
                      paddingRight: width * 0.125,
                      paddingTop: width * 0.05,
                      paddingBottom: width * 0.05,
                      borderRadius: 10,
                      marginTop: 50,
                    }}
                    titleStyle={{
                      fontWeight: "500",
                      color: colorScheme === "dark" ? "black" : "white",
                    }}
                    icon={
                      <Icon
                        name="close-circle-outline"
                        type="ionicon"
                        color={colorScheme === "dark" ? "black" : "white"}
                        style={{
                          paddingRight: 15,
                        }}
                      />
                    }
                    onPress={() => {
                      deactivateKeepAwake();
                      setModalVisible(!modalVisible);
                    }}
                  />
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
};

export default SendScreen;
