// React, React Native imports

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

import {
  Platform,
  Text,
  useColorScheme,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
  Share,
} from "react-native";

// Components, Expo and RN libraries

import { StatusBar } from "expo-status-bar";
import * as Clipboard from "expo-clipboard";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";

import { Input, Icon, Button } from "react-native-elements";
import { Notifier, NotifierComponents } from "react-native-notifier";

// Functional packages

import fetch from "node-fetch";
import mime from "mime-types";

// Local functions, components and variables

import { validationMsg, checkError, truncate } from "../lib/functions";
import chooseIcon from "../lib/files/chooseIcon";
import { styles } from "../lib/pages";
import { config, colors, inputProps } from "../lib/vars";

import LogoImage from "../components/LogoImage";
import CustomBackground from "../components/BottomSheetBackground";
import CustomHandle from "../components/CustomHandle";

// Root component

const HomeScreen: React.FC = () => {
  // Variable set
  const [isLoading, setLoading] = useState<boolean>(false); // Loading status => only show the responce of the API

  // Dynamically loaded data from the Interclip REST API
  const [data, setData] = useState<{ result: string; status: string }>({
    result: "https://files.interclip.app/ecf3e43230.jpg",
    status: "success",
  });
  const bottomSheetRef = useRef(null);
  const url = data.result;
  const fileExtension = url.split(".")[url.split(".").length - 1];

  const fileIcon = chooseIcon(fileExtension);

  const [statusCode, setStatusCode] = useState<number>(200);
  const [text, setText] = useState<string>(""); // The code entered in the <Input>

  const colorScheme = useColorScheme();

  // variables
  const snapPoints = useMemo(() => ["22%", "65%"], []);

  const handleClosePress = () => bottomSheetRef.current.close();
  const handleOpenPress = () => bottomSheetRef.current.snapToIndex(1);

  const { width } = Dimensions.get("window");

  const handleSheetChanges = useCallback((_fromIndex, toIndex) => {
    if (Platform.OS === "ios") {
      let hapticStrength: Haptics.ImpactFeedbackStyle | boolean = false;
      switch (toIndex) {
        case 0:
          hapticStrength = Haptics.ImpactFeedbackStyle.Medium;
          break;
        case 1:
        case 2:
          hapticStrength = Haptics.ImpactFeedbackStyle.Light;
          break;
      }
      hapticStrength !== false && Haptics.impactAsync(hapticStrength);
    }
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (text.length === config.codeLength) {
      setText(text.replace(" ", "").toLowerCase());
      setLoading(true);
      fetch(`https://interclip.app/api/get?code=${text}`)
        .then((response: { ok: boolean; json: () => any; status: number }) => {
          if (response.ok) {
            setStatusCode(200);
            return response.json();
          } else {
            if (response.status === 429) {
              Notifier.showNotification({
                title: "Slow down!",
                description: "We are getting too many requests from you.",
                Component: NotifierComponents.Alert,
                componentProps: {
                  alertType: "error",
                },
              });
              return {};
            } else {
              if (config.exemptStatusCodes.includes(response.status)) {
                setStatusCode(response.status);
                return response.json();
              } else {
                setStatusCode(400);
                Notifier.showNotification({
                  title: `Got the error ${response.status}`,
                  Component: NotifierComponents.Alert,
                  componentProps: {
                    alertType: "error",
                  },
                });
                return response.json();
              }
            }
          }
        })
        .then((json: { result: string }) => {
          const URLArr = json.result.split("/");
          const result = `${URLArr[0]}//${URLArr[2]}`;

          if (result === "https://files.interclip.app") {
            handleOpenPress();
          } else {
            handleClosePress();
          }

          setData(json);
        })
        .catch((error: { message: string }) => {
          Notifier.showNotification({
            title: "Error",
            description: error.message,
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: "error",
            },
          });
          setStatusCode(400);
        })
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
                : Notifier.showNotification({
                    title: `No URL set yet, make sure your code is ${config.codeLength} characters long!`,
                    Component: NotifierComponents.Alert,
                    componentProps: {
                      alertType: "error",
                    },
                  });
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
                    Notifier.showNotification({
                      title: "The URL has been copied to your clipboard!",
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
                onPress={() => {
                  Linking.openURL(data.result);
                }}
                style={{
                  textAlign: "center",
                  color: checkError(data.status)
                    ? colors.light
                    : colorScheme === "dark"
                    ? colors.light
                    : colors.text,
                  backgroundColor:
                    checkError(data.status) && !validationMsg(text)
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
                    : truncate(
                        data?.result ? data.result.replace("https://", "") : "",
                        80
                      ))}
              </Text>
            ) : (
              <ActivityIndicator />
            )}
          </View>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
      <BottomSheet
        backgroundComponent={colorScheme === "dark" && CustomBackground}
        handleComponent={CustomHandle}
        onAnimate={handleSheetChanges}
        enablePanDownToClose
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
      >
        <View style={{ ...styles.contentContainer }}>
          <View style={{ marginBottom: "10%" }}>
            {fileIcon}
            <Text
              style={{
                fontSize: 25,
                textAlign: "center",
                color: colorScheme === "dark" ? "white" : "black",
              }}
            >
              {fileExtension.length < 20 ? fileExtension : "arbitrary"} file
            </Text>
            {mime.lookup(fileExtension) && (
              <Text
                style={{
                  fontSize: 10,
                  textAlign: "center",
                  maxWidth: "40%",
                  color: colorScheme === "dark" ? "white" : "black",
                }}
              >
                {mime.lookup(fileExtension)}
              </Text>
            )}
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 20,
            }}
          >
            <Button
              title="Share"
              buttonStyle={{
                textAlign: "center",
                backgroundColor: "#367FFA",
                width: width / 3,
                paddingTop: width * 0.05,
                paddingBottom: width * 0.05,
                borderRadius: 10,
                marginRight: "5%",
              }}
              iconPosition="top"
              icon={
                <Icon name="share" type="ionicon" size={35} color="white" />
              }
              titleStyle={{
                fontWeight: "500",
              }}
              onPress={onShare}
            />
            <Button
              title="View"
              buttonStyle={{
                textAlign: "center",
                backgroundColor: "#367FFA",
                width: width / 3,
                paddingTop: width * 0.05,
                paddingBottom: width * 0.05,
                borderRadius: 10,
                marginLeft: "5%",
              }}
              iconPosition="top"
              icon={<Icon name="open" type="ionicon" size={35} color="white" />}
              titleStyle={{
                fontWeight: "500",
              }}
              onPress={() => Linking.openURL(url)}
            />
          </View>
          <Button
            title="Close"
            buttonStyle={{
              textAlign: "center",
              backgroundColor: "#367FFA",
              paddingLeft: width * 0.1,
              paddingRight: width * 0.1,
              paddingTop: width * 0.03,
              paddingBottom: width * 0.03,
              borderRadius: 10,
              marginBottom: "10%",
            }}
            titleStyle={{
              fontWeight: "500",
            }}
            onPress={handleClosePress}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default HomeScreen;
