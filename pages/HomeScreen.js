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
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
  Share,
} from "react-native";

// Components, Expo and RN libraries

import { StatusBar } from "expo-status-bar";
import Clipboard from "expo-clipboard";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Linking from "expo-linking";

import { Input, Icon, Button } from "react-native-elements";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "@react-navigation/native";

import Animated, {
  interpolateColors,
} from "react-native-reanimated";

// Functional packages

import fetch from "node-fetch";
const mime = require("mime-types");

// Local functions, components and variables

import { validationMsg, checkError, truncate } from "../lib/functions";
import { styles } from "../lib/Pages";
import { config, colors, inputProps } from "../lib/Vars";

import LogoImage from "../components/LogoImage";

const CustomBackground = ({ animatedIndex, style }) => {
  const colorScheme = useColorScheme();

  // animated variables
  const animatedBackground = useMemo(
    () =>
      interpolateColors(animatedIndex, {
        inputRange: [0, 1],
        outputColorRange:
          colorScheme === "dark" ? ["#333", "#404040"] : ["#fff", "#fff"],
      }),
    [animatedIndex]
  );

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: animatedBackground,
      },
    ],
    [style, animatedBackground]
  );

  return <Animated.View style={containerStyle} />;
};

// Root component

export function HomeScreen({ navigation }) {
  // Variable set
  const [isLoading, setLoading] = useState(false); // Loading status => only show the responce of the API
  const [bottomSheetIndex, setBottomSheetIndex] = useState(0);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
    setBottomSheetIndex(index);
  }, []);

  // After the request completes
  const [data, setData] = useState(""); // Dynamically loaded data from the Interclip REST API
  const bottomSheetRef = useRef(null);
  const url = data.result || "https://files.interclip.app/ecf3e43230.jpg";
  const fileExtension = url.split(".")[url.split(".").length - 1];

  let filetype = "";
  let fileIcon = "file";

  switch (fileExtension) {
    case "jpg":
    case "png":
    case "avif":
    case "webp":
      fileIcon = "file-image";
      break;
    case "mp3":
    case "wav":
      fileIcon = "file-audio";
      break;
    case "mp4":
    case "mov":
      fileIcon = "file-video";
      break;
    case "pdf":
      fileIcon = "file-pdf";
      break;
    case "zip":
    case "tar":
    case "gz":
      fileIcon = "file-archive";
      break;
    case "pptx":
    case "ppt":
    case "odp":
    case "pptm":
      fileIcon = "file-powerpoint";
      break;
    default:
      fileIcon = "file";
  }

  const [statusCode, setStatusCode] = useState(200);
  const [text, setText] = useState(""); // The code entered in the <Input>

  const colorScheme = useColorScheme();

  // variables
  const snapPoints = useMemo(() => [0, "22%", "65%"], []);

  const handleClosePress = () => bottomSheetRef.current.close();
  const handleOpenPress = () => bottomSheetRef.current.snapTo(1);

  const { width } = Dimensions.get("window");

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
            handleOpenPress();
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
      <BottomSheet
        backgroundComponent={CustomBackground}
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        style={{ backgroundColor: "red" }}
      >
        <View style={{ ...styles.contentContainer }}>
          <View style={{ marginBottom: "10%" }}>
            <Icon
              name={fileIcon}
              type="font-awesome-5"
              size={80}
              color="#367FFA"
            />
            <Text
              style={{
                fontSize: 25,
                textAlign: "center",
                color: colorScheme === "dark" ? "white" : "black",
              }}
            >
              {fileExtension} file
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
}
