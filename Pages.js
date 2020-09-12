import Clipboard from "@react-native-community/clipboard";
import { BarCodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Appearance,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  Settings,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  useColorScheme,
  Vibration,
  View,
} from "react-native";
import { Header, Icon, Input } from "react-native-elements";
import QRCode from "react-native-qrcode-svg";

/* 3rd party libraries */

import { isURL } from "./functions";
import { iclipUri } from "./Vars";

/* Function and config */
const checkError = (msg) => {
  return msg.indexOf("Error: ") > -1;
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const imgCheck = (url, inval) => {
  if (inval === "") return false;
  if (typeof url !== "string") return false;
  return !!url.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi);
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

const urlValidation = (url) => {
  url = url.split(" ").join("%20");
  url = url.split("<").join("&gt;");
  url = url.split(">").join("&lt;");

  if (url.length === 0) return "Start pasting or typing in the URL";
  if (!url.match(config.urlRegex)) {
    return `This doesn't seem to be a valid URL`;
  }
};

// const entireScreenHeight = Dimensions.get("window").height;
const entireScreenWidth = Dimensions.get("window").width;

const config = {
  codeMaxLength: 5, // The code's length has to be always 5 characters
  charRegex: new RegExp("[^A-Za-z0-9]"), // Only allow ascii characters to be entered as the code
  urlRegex: new RegExp(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
  ),
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
  previewImg: {
    width: 100,
    height: 100,
    marginLeft: entireScreenWidth / 3 + 10,
    marginBottom: "20%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  openButton: { borderRadius: 20, padding: 10, elevation: 2, marginTop: 10 },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center" },
  modalText: { marginBottom: 15, textAlign: "center" },
});

/* Colors and stuff */
const colors = {
  bg: "white",
  headerBg: "#444444",
  text: "black",
  errorColor: "#f44336",
  light: "white",
};

export function HomeScreen({ navigation }) {
  /* Variable set */
  const [isLoading, setLoading] = useState(true); // Loading status => only show the responce of the API
  // after the request completes
  const [data, setData] = useState(""); // Dynamically loaded data from the Interclip REST API
  const [text, setText] = useState(""); // The code entered in the <Input>
  // const [progress, setProgress] = useState("");

  const colorScheme = useColorScheme();

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
    <View
      style={{
        backgroundColor: colorScheme === "dark" ? "#444444" : "#f4f4f4",
      }}
    >
      {" "}
      <Header
        containerStyle={{
          // backgroundColor: colors.headerBg,
          backgroundColor: "white",
          justifyContent: "space-around",
          marginBottom: Platform.OS === "ios" ? "20%" : "5%",
        }}
      >
        {" "}
        <Icon
          onPress={() => navigation.navigate("QR")}
          type="font-awesome" // The icon is loaded from the font awesome icon library
          name="qrcode" // Icon fa-qrcode
          color="#000" // White color for contrast on the Header
        />{" "}
        <View>
          <Text style={{ fontSize: 30 }}>Interclip</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Settings")}
        >
          {" "}
          <Icon
            type="font-awesome" // The icon is loaded from the font awesome icon library
            name="cog" // Icon fa-cog
            color="#000" // White color for contrast on the Header
          />{" "}
        </TouchableOpacity>
      </Header>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Send")}>
          {" "}
          <Image
            style={styles.previewImg}
            source={{
              uri: imgCheck(data, text)
                ? `https://external.iclip.trnck.dev/image?url=${data}`
                : "https://raw.githubusercontent.com/aperta-principium/Interclip/master/img/interclip_logo.png",
            }}
          />
        </TouchableOpacity>{" "}
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
                /*
        Clipboard.setString(data);
        alert("Copied to Clipboard!");
      */
              }}
              onPress={() => {
                Linking.openURL(data);
              }}
              style={{
                color: checkError(data)
                  ? colors.light
                  : colorScheme === "dark"
                  ? "white"
                  : colors.text,
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

  const colorScheme = useColorScheme();

  const handleBarCodeScanned = ({ _type, data }) => {
    setScanned(true);

    const URLArr = data.split("/");
    const result = URLArr[0] + "//" + URLArr[2];

    if (
      (result === "https://iclip.netlify.com") |
      (result === "http://iclip.netlify.app") |
      Settings.get("data")
    ) {
      Vibration.vibrate();
      data.indexOf("http") > -1
        ? Linking.openURL(data)
        : Link.openURL("http://" + data)
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
    } else if (isURL(data)) {
      Alert.alert("It is't even a URL", "Of a sort we know of", [
        {
          text: "OK then",
          onPress: () => {
            setScanned(false);
          },
        },
      ]);
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
      {" "}
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

  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colorScheme === "dark" ? "#444444" : "#f4f4f4",
      }}
    >
      <Text
        style={{
          color: colorScheme === "dark" ? "white" : "black",
        }}
      >
        Open all QR Codes automatically
      </Text>
      <Switch
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={data}
      />
    </View>
  );
}

export function SendScreen({ navigation }) {
  /* Variable set */
  const [isLoading, setLoading] = useState(true); // Loading status => only show the responce of the API
  // after the request completes
  const [data, setData] = useState(""); // Dynamically loaded data from the Interclip REST API
  const [text, setText] = useState(""); // The code entered in the <Input>
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme();

  useEffect(() => {
    setText(text.replace(" ", "").toLowerCase());
    fetch(`http://uni.hys.cz/includes/api?url=${text}`)
      .then((response) => response.text())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    setLoading(true);
  }, [text]);
  return (
    <View
      style={{
        backgroundColor: colorScheme === "dark" ? "#444444" : "",
        color: colorScheme === "dark" ? "#ffffff" : "#000000",
        marginTop: Platform.OS === "ios" ? "20%" : "5%",
      }}
    >
      {" "}
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          {" "}
          <Image
            style={styles.previewImg}
            source={{
              uri: imgCheck(data, text)
                ? `https://external.iclip.trnck.dev/image?url=${data}`
                : "https://raw.githubusercontent.com/aperta-principium/Interclip/master/img/interclip_logo.png",
            }}
          />
        </TouchableOpacity>{" "}
        <Input
          keyboardType={Platform.OS === "android" ? "default" : "url"}
          style={styles.container}
          placeholder="Your URL here"
          inputStyle={{ fontSize: 25 }}
          autoCorrect={false}
          autoCompleteType={"off"}
          returnKeyType={Platform.OS === "android" ? "none" : "done"}
          onChangeText={(text) => setText(text)}
          defaultValue={text}
          errorStyle={{ color: "red" }}
          autoCapitalize="none"
          autoFocus={true}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={() => {
            !isLoading && Linking.openURL(data);
          }}
        />
        {urlValidation(text) && (
          <View style={{ padding: 24 }}>
            <Text>{urlValidation(text)}</Text>
          </View>
        )}
        <View style={{ padding: 24, flexDirection: "row" }}>
          {isLoading ? (
            <Text></Text>
          ) : (
            <Text
              onPress={() => {
                Linking.openURL(data);
              }}
              style={{
                color: checkError(data) ? colors.light : colors.text,
                backgroundColor:
                  checkError(data) & !urlValidation(text)
                    ? colors.errorColor
                    : null,
                fontSize: 40,
                marginLeft: "20%",
              }}
            >
              {" "}
              {!urlValidation(text) &&
                (checkError(data) ? "Something went wrong 🤔" : data)}{" "}
            </Text>
          )}

          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <QRCode
                  value={`https:/ /
                 iclip.netlify.app / r / $ { data } `}
                  size={250}
                  logo={{ uri: iclipUri }}
                  logoSize={60}
                  logoBackgroundColor="white"
                />
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Hide QR Code</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          {!urlValidation(text) ? (
            <Icon
              type="font-awesome" // The icon is loaded from the font awesome icon library
              name="qrcode" // Icon fa-qrcode
              color="#000" // White color for contrast on the Header
              style={{ width: 70 }}
              onPress={() => {
                setModalVisible(true);
              }}
              size={50}
            />
          ) : (
            <Text></Text>
          )}
        </View>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}
