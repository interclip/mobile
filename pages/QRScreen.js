// React, React Native imports

import React, { useEffect, useState } from "react";
import {
  Alert,
  Settings,
  Text,
  Dimensions,
  useColorScheme,
  Vibration,
  View,
  Pressable,
} from "react-native";

// Components, Expo and RN libraries

import Clipboard from "@react-native-community/clipboard";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Linking from "expo-linking";

// Local functions and variables

import isURL from "validator/lib/isURL";
import { sleep } from "../lib/functions";
import { colors } from "../lib/Vars";
import { styles } from "../lib/Pages";

// Root component

export function QRScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [qrd, setQrd] = useState(false);
  const [cameraRotation, setCameraRotation] = useState(
    BarCodeScanner.Constants.Type.back
  );
  const [lastClick, setLastClick] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const colorScheme = useColorScheme();

  const handleBarCodeScanned = ({ data }) => {
    setQrd(true);
    const URLArr = data.split("/");
    const result = `${URLArr[0]}//${URLArr[2]}`;

    if (
      (result === "https://iclip.netlify.com") |
      (result === "https://iclip.netlify.app") |
      (result === "https://interclip.app") |
      Settings.get("data")
    ) {
      Vibration.vibrate();
      URLArr[0].includes("http")
        ? Linking.openURL(data).catch((e) => e)
        : Linking.openURL(`http://${data}`)
            .then(() => {
              sleep(500).then(setQrd(false));
              navigation.navigate("Home");
            })
            .catch((e) => {
              Alert.alert(
                "An error has occured",
                "This link is probably broken or isn't even a link",
                [
                  {
                    text: "OK",
                  },
                  {
                    text: "Copy the error to clipboard",
                    onPress: () => {
                      Clipboard.setString(e);
                    },
                  },
                ]
              );
            });
    } else if (!isURL(data)) {
      Alert.alert(
        "This doesn't look like a URL",
        "Or it's really weird and I have no idea what you're trying to do",
        [
          {
            text: "OK then",
            onPress: () => {
              sleep(1000).then(setQrd(false));
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "This doesn't appear to be an Interclip URL",
        "Do you still want to open it?",
        [
          {
            text: "Cancel",
            onPress: () => {
              setQrd(true);
              sleep(1000).then(setQrd(false));
            },
            style: "cancel",
          },
          {
            text: "Sure",
            onPress: () => {
              Linking.openURL(data);
            },
          },
        ]
      );
    }
  };

  const { width } = Dimensions.get("window");

  const qrStyles = {
    borderColor: "#42C759",
    borderWidth: 17,
    borderRadius: "20%"
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor:
          colorScheme === "dark" ? colors.darkContent : colors.lightContent,
      }}
    >
      <Text
        style={{
          fontSize: 40,
          marginBottom: 20,
          color: colorScheme === "dark" ? colors.light : colors.text,
          fontWeight: "600",
        }}
      >
        QR Code
      </Text>
      <Text
        style={{
          fontSize: 17,
          maxWidth: width * 0.7,
          marginBottom: 30,
          textAlign: "center",
          color: colorScheme === "dark" ? colors.light : colors.text,
        }}
      >
        Center your QR code in the square below
      </Text>
      <Pressable
        style={qrd ? qrStyles : {}}
        onPress={() => {
          if (lastClick) {
            const newRotation =
              cameraRotation === BarCodeScanner.Constants.Type.back
                ? BarCodeScanner.Constants.Type.front
                : BarCodeScanner.Constants.Type.back;
            setCameraRotation(newRotation);
          } else {
            setLastClick(true);
            setTimeout(() => {
              setLastClick(null);
            }, 500);
          }
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={qrd ? undefined : handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          type={cameraRotation}
          style={{
            width: width * 0.7,
            height: width * 0.7,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </Pressable>
    </View>
  );
}
