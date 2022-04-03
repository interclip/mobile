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

import mime from "mime-types";

// Local functions, components and variables

import { truncate, isValidClipCode } from "../lib/functions";
import chooseIcon from "../lib/files/chooseIcon";
import { styles } from "../lib/pages";
import { config, colors, inputProps } from "../lib/constants";

import LogoImage from "../components/LogoImage";
import CustomBackground from "../components/BottomSheetBackground";
import CustomHandle from "../components/CustomHandle";
import { getClip } from "../lib/requestClip";
import URL from "whatwg-url";

// Root component

const HomeScreen: React.FC = () => {
  // Variable set
  const [isLoading, setLoading] = useState<boolean>(false); // Loading status => only show the response of the API
  const [isError, setError] = useState<string | false>(false);

  // Dynamically loaded data from the Interclip REST API
  const [url, setURL] = useState<string | null>(null);
  const bottomSheetRef = useRef(null);
  const fileExtension = url && url.split(".")[url.split(".").length - 1];

  const fileIcon = chooseIcon(fileExtension);

  const [statusCode, setStatusCode] = useState<number>(200);
  const [text, setText] = useState<string>(""); // The code entered in the <Input>

  const colorScheme = useColorScheme();

  // variables
  const snapPoints = useMemo(() => ["22%", "65%"], []);

  const handleClosePress = () => bottomSheetRef.current.close();
  const handleOpenPress = () => bottomSheetRef.current.snapToIndex(0);

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
    if (
      text.length >= config.minimumCodeLength &&
      text.length <= config.maximumCodeLength
    ) {
      setText(text.replace(" ", "").toLowerCase());
      setLoading(true);
      getClip(text)
        .then((data) => {
          if (data.status === "success") {
            setError(false);
            setStatusCode(200);
            setURL(data.result.url);

            const host = URL.serializeHost(data.result.url);
            if (host === "files.interclip.app") {
              handleOpenPress();
            } else {
              handleClosePress();
            }
          } else {
            setStatusCode(data.code);
            setError(data.result);
            if (data.code !== 404) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Notifier.showNotification({
                title: `${data.result} (HTTP ${data.code})`,
                Component: NotifierComponents.Alert,
                componentProps: {
                  alertType: "error",
                },
              });
            } else {
              setError("This code doesn't seem to exist 🤔");
            }
          }
        })
        .catch((e) => alert(e))
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
            maxLength={config.maximumCodeLength}
            inputStyle={{ fontSize: 50 }}
            onChangeText={(text) => setText(text)}
            defaultValue={text}
            value={text.replace(" ", "").toLowerCase()}
            onSubmitEditing={() => {
              !isLoading
                ? Linking.openURL(url)
                : Notifier.showNotification({
                    title: `No URL set yet, make sure your code is at least ${config.minimumCodeLength} characters long!`,
                    Component: NotifierComponents.Alert,
                    componentProps: {
                      alertType: "error",
                    },
                  });
            }}
          />
          {isValidClipCode(text) && (
            <View style={{ padding: 24 }}>
              <Text
                style={{
                  color: colorScheme === "dark" ? colors.light : colors.text,
                }}
              >
                {isValidClipCode(text)}
              </Text>
            </View>
          )}
          <View style={{ padding: 24 }}>
            {!isLoading ? (
              <Text
                onLongPress={() => {
                  // Handle functionality, when user presses for a longer period of time
                  try {
                    Clipboard.setString(isError || url);
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
                  Linking.openURL(url);
                }}
                style={{
                  textAlign: "center",
                  color: isError
                    ? colors.light
                    : colorScheme === "dark"
                    ? colors.light
                    : colors.text,
                  backgroundColor:
                    isError && isValidClipCode(text) ? colors.errorColor : null,
                  fontSize: 20,
                  marginLeft: "auto",
                  marginRight: "auto",
                  padding: 5,
                  borderRadius: 10,
                }}
              >
                {isValidClipCode(text) &&
                  (isError ||
                    truncate(url ? url.replace("https://", "") : "", 80))}
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
              {url && fileExtension.length < 20 ? fileExtension : "arbitrary"}{" "}
              file
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
