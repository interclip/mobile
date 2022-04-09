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

import { useIsFocused } from "@react-navigation/native";

// Local functions and variables

import isURL from "validator/lib/isURL";
import { sleep } from "../lib/functions";
import { apiEndpoint, colors } from "../lib/constants";
import { styles } from "../lib/pages";

import URL from "url-parse";

// Root component

const QRScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [qrd, setQrd] = useState<boolean>(false);
  const [cameraRotation, setCameraRotation] = useState(
    BarCodeScanner.Constants.Type.back
  );
  const [lastClick, setLastClick] = useState<boolean>(false);

  const isFocused: boolean = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const colorScheme = useColorScheme();

  const handleBarCodeScanned = ({ data }) => {
    setQrd(true);

    if (typeof data !== "string" || !isURL(data)) {
      Alert.alert(
        "This doesn't look like a URL",
        "Or it's really weird and I have no idea what you're trying to do",
        [
          {
            text: "OK then",
            onPress: () => {
              sleep(1000).then(() => setQrd(false));
            },
          },
        ]
      );
      return;
    }

    const url = new URL(data);
    const { hostname } = url;

    if (
      (hostname === "iclip.netlify.com" ||
        hostname === "iclip.netlify.app" ||
        hostname === new URL(apiEndpoint).hostname ||
        Settings.get("data")) &&
      isURL(data)
    ) {
      Vibration.vibrate();
      Linking.openURL(data)
        .catch((e) => e)
        .then(() => {
          sleep(1000).then(() => {
            setQrd(false);
          });
        });
    } else {
      Alert.alert(
        "This doesn't appear to be an Interclip URL",
        "Do you still want to open it?",
        [
          {
            text: "Cancel",
            onPress: () => {
              sleep(1000).then(() => setQrd(false));
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
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (!hasPermission) {
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
        style={qrd ? qrStyles : undefined}
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
        {isFocused && (
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
        )}
      </Pressable>
    </View>
  );
};

export default QRScreen;
