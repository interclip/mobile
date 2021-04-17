import Clipboard from "@react-native-community/clipboard";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from "react";
import {
  Alert,
  Settings,
  StyleSheet,
  Text,
  useColorScheme,
  Vibration,
  View,
} from "react-native";
import isURL from 'validator/lib/isURL';
import { sleep, styles, colors } from "../Pages";

export function QRScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [qrd, setQrd] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const colorScheme = useColorScheme();

  const handleBarCodeScanned = ({ data }) => {
    if (!qrd) {
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
          ? Linking.openURL(data).catch((e) => (e))
          : Linking.openURL(`http://${data}`)
              .then(() => {
                navigation.navigate("Home");
                setQrd(false);
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
                setQrd(false);
              },
            },
          ]
        );
      }
      sleep(2000).then(setQrd(false));
    }
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
        backgroundColor: colorScheme === "dark" ? colors.darkContent : colors.lightContent,
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}
