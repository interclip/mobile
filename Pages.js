import { StatusBar } from "expo-status-bar";
import { BarCodeScanner } from "expo-barcode-scanner";

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Settings,
  Switch,
  Text,
  View,
  Linking,
  Clipboard,
  Image,
  Dimensions,
  Platform,
  Alert,
  Vibration,
  TouchableOpacity,
} from "react-native";

/* 3rd party libraries */

import { iclipUri } from "./Vars";
import { isURL } from "./functions";
import { Header, Input, Icon } from "react-native-elements";

/* Function and config */
const checkError = (msg) => {
  return msg.indexOf("Error: ") > -1;
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const ValidationMsg = (txt) => {
  txt = txt.replace(" ", "").toLowerCase();
  const diff = config.codeMaxLength - txt.length;
  if (txt.match(config.charRegex)) {
    return `There are some characters, that shouldn't be there.`;
  } else {
    if ((txt.length < config.codeMaxLength) & (txt.length > 0)) {
      return `${diff} more character${diff === 1 ? "" : "s"} please`;
    } else if (txt.length === 0) {
      return `Just type in the code above and see the magic happen.`;
    }
  }
};

const entireScreenHeight = Dimensions.get("window").height;

const config = {
  codeMaxLength: 5, // The code's length has to be always 5 characters
  charRegex: new RegExp("[^A-Za-z0-9]"), // Only allow ascii characters to be entered as the code
};
/* Styles */
const styles = StyleSheet.create({
  container: {
    alignItems: "center", // Centered horizontally
    justifyContent: "center",
    flex: 1,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
});
/* Colors and stuff */
const colors = {
  bg: "white",
  headerBg: "#333333",
  text: "black",
  errorColor: "#f44336",
  light: "white",
};
export function HomeScreen({ navigation }) {
  /* Variable set */
  const [isLoading, setLoading] = useState(true); // Loading status => only show the responce of the API after the request completes
  const [data, setData] = useState(""); // Dynamically loaded data from the Interclip REST API
  const [text, setText] = useState(""); // The code entered in the <Input>
  const [progress, setProgress] = useState("");

  useEffect(() => {
    if (text.length === config.codeMaxLength) {
      setText(text.replace(" ", "").toLowerCase());
      fetch(`http://uni.hys.cz/includes/get-api?user=${text}`)
        .then((response) => response.text())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [text]);
  return (
    <View style={{ backgroundColor: "" }}>
      <Header
        containerStyle={{
          //backgroundColor: colors.headerBg,
          backgroundColor: "white",
          justifyContent: "space-around",
          marginBottom: Platform.OS === "ios" ? "45%" : "25%",
        }}
      >
        <Icon
          onPress={() => navigation.navigate("QR")}
          type="font-awesome" // The icon is loaded from the font awesome icon library
          name="qrcode" // Icon fa-qrcode
          color="#000" // White color for contrast on the Header
        />

        <Text style={{ fontSize: 30 }}>Interclip</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Settings")}
        >
          <Image
            style={styles.tinyLogo}
            source={{
              uri: iclipUri,
            }}
          />
        </TouchableOpacity>
      </Header>

      <View>
        <Input
          keyboardType={
            Platform.OS === "android" ? "email-address" : "ascii-capable"
          }
          style={styles.container}
          placeholder="Your code here"
          maxLength={config.codeMaxLength}
          inputStyle={{ fontSize: 50 }}
          autoCorrect={false}
          returnKeyType={"go"}
          onChangeText={(text) => setText(text)}
          defaultValue={text}
          errorStyle={{ color: "red" }}
          autoCapitalize="none"
          autoFocus={true}
          value={text.replace(" ", "").toLowerCase()}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={() => {
            !isLoading
              ? Linking.openURL(data)
              : alert(
                  `No URL set yet, make sure your code is ${config.codeMaxLength} characters long!`
                );
          }}
        />
        {ValidationMsg(text) && (
          <View style={{ padding: 24 }}>
            <Text>{ValidationMsg(text)}</Text>
          </View>
        )}
        <View style={{ padding: 24 }}>
          {isLoading ? (
            <Text></Text>
          ) : (
            <Text
              onLongPress={() => {
                /* Handle functionality, when user presses for a longer period of time */
                Clipboard.setString(data);
                alert("Copied to Clipboard!");
              }}
              onPress={() => {
                Linking.openURL(data);
              }}
              style={{
                color: checkError(data) ? colors.light : colors.text,
                backgroundColor:
                  checkError(data) & !ValidationMsg(text)
                    ? colors.errorColor
                    : null,
                fontSize: 20,
              }}
            >
              {!ValidationMsg(text) &&
                (checkError(data)
                  ? "This code doesn't seem to exist 🤔"
                  : data)}
            </Text>
          )}
        </View>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

export function QRScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if (
      (data.indexOf("https://iclip.netlify.com") > -1) |
      (data.indexOf("http://iclip.netlify.app") > -1) |
      Settings.get("data")
    ) {
      Vibration.vibrate();
      navigation.navigate("Home");
      Linking.openURL(data);
      setScanned(false);
    } else if (isURL(data)) {
      Alert.alert("It isn't even a URL");
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
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
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
export function SettingsPage() {
  const [isEnabled, setIsEnabled] = useState();
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    storeData({ data: isEnabled });
  };
  const [data, setData] = useState(Settings.get("data"));
  const storeData = (data) => {
    data.data = !data.data;
    Settings.set(data);
    setData(Settings.get("data"));
  };

  return (
    <View style={styles.container}>
      <Text style={{}}>Open all QR Codes automatically</Text>
      <Switch
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={data}
      />
    </View>
  );
}
