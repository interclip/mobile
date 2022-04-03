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

import isURL from "validator/lib/isURL";

// Local functions, components and variables
import { apiEndpoint, colors, inputProps } from "../lib/constants";
import { urlValidation, checkError } from "../lib/functions";
import { styles } from "../lib/pages";

import LogoImage from "../components/LogoImage";
import { requestClip } from "../lib/requestClip";
import { Clip, SuccessResponse } from "../typings/interclip";

// Root component

const SendScreen: React.FC = () => {
  // Variable set
  const [isLoading, setLoading] = useState<boolean>(false); // Loading status => only show the response of the API
  const [isError, setError] = useState<string | null>(null);

  // after the request completes
  const [data, setData] = useState<SuccessResponse<Clip> | null>(null); // Dynamically loaded data from the Interclip REST API
  const [enteredUrl, setEnteredUrl] = useState(""); // The code entered in the <Input>
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme();
  const { width } = Dimensions.get("window");

  const pasteFromClipboard = async () => {
    const pasteboard = await Clipboard.getStringAsync();
    if (isURL(pasteboard)) {
      setEnteredUrl(pasteboard);
    }
  };
  useEffect(() => {
    (async () => {
      pasteFromClipboard();
    })();
  }, []);

  useEffect(() => {
    setEnteredUrl(enteredUrl.trim().toLowerCase());
    if (enteredUrl && isURL(enteredUrl, { require_protocol: true })) {
      requestClip(enteredUrl)
        .then(async (result) => {
          if (result.status === "success") {
            setData(result);
          } else {
            Notifier.showNotification({
              title: `Error (HTTP ${result.code})`,
              description: result.result,
              Component: NotifierComponents.Alert,
              componentProps: {
                alertType: "error",
              },
            });
            setError(result.result);
          }
        })
        .finally(() => setLoading(false));

      setLoading(true);
    }
  }, [enteredUrl]);
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
            onChangeText={(text) => setEnteredUrl(text)}
            defaultValue={enteredUrl}
            onSubmitEditing={() => {
              Keyboard.dismiss;
            }}
          />
          {urlValidation(enteredUrl) && (
            <View style={{ padding: 24 }}>
              <Text
                style={{
                  color: colorScheme === "dark" ? colors.light : colors.text,
                }}
              >
                {urlValidation(enteredUrl)}
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
                    Clipboard.setString(data.result.code);
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
                    isError && !urlValidation(enteredUrl)
                      ? colors.errorColor
                      : null,
                  fontSize: 40,
                  marginLeft: "20%",
                }}
              >
                {data && data.result.code.slice(0, data.result.hashLength)}
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
                    value={data && `${apiEndpoint}/${data.result.code}`}
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
            {isURL(enteredUrl, { require_protocol: true }) && (
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
