import Clipboard from "@react-native-community/clipboard";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Settings,
  StyleSheet,
  Text,
  useColorScheme,
  Vibration,
  View,
} from "react-native";
import { isURL } from "../functions";
import { sleep, styles } from "../Pages";

export function QRScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const colorScheme = useColorScheme();

  const handleBarCodeScanned = ({ _type, data }) => {
    setScanned(true);

    const URLArr = data.split("/");
    const result = URLArr[0] + "//" + URLArr[2];

    if (
      (result === "https://iclip.netlify.com") |
      (result === "https://iclip.netlify.app") |
      Settings.get("data")
    ) {
      Vibration.vibrate();
      data.includes("http")
        ? Linking.openURL(data)
        : Linking.openURL(`http://${data}`)
            .then(() => {
              navigation.navigate("Home");
              setScanned(false);
            })
            .catch((e) => {
              Alert.alert(
                "An error has occured",
                "This link is probably broken or isn't even a link",
                [
                  {
                    text: "OK bro",
                    onPress: () => {
                      setScanned(false);
                    },
                  },
                  {
                    text: "Copy the error to clipboard",
                    onPress: () => {
                      Clipboard.setString(e);
                      setScanned(false);
                    },
                  },
                ]
              );
            });
    } else if (!isURL(data)) {
      Alert.alert(
        "This doesn't look like an URL",
        "Or it's really weird and I have no idea what you're trying to do",
        [
          {
            text: "OK then",
            onPress: () => {
              setScanned(false);
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
              setScanned(true);
              sleep(1000).then(setScanned(false));
            },
            style: "cancel",
          },
          {
            text: "Sure",
            onPress: () => {
              Linking.openURL(data);
              setScanned(false);
            },
          },
        ]
      );
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
        backgroundColor: colorScheme === "dark" ? "#444444" : "#f4f4f4",
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}
