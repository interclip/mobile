import { StatusBar } from "expo-status-bar";
import Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert
} from "react-native";
import { Header, Icon, Input } from "react-native-elements";
import {
  config,
  colors,
  styles,
  imgCheck,
  validationMsg,
  checkError,
} from "../Pages";

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
      fetch(`https://interclip.app/includes/get-api?code=${text}`)
        .then((response) => response.json())
        .then((json) => setData(json))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [text]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? colors.darkContent : colors.lightContent,
      }}
    >
      <Header
        containerStyle={{
          // backgroundColor: colors.headerBg,
          backgroundColor:
            colorScheme === "dark" ? colors.darkHeader : colors.lightHeader,
          color: colorScheme === "dark" ? "white" : "black",
          justifyContent: "space-around",
          marginBottom: Platform.OS === "ios" ? "20%" : "5%",
        }}
      >
        <Icon
          onPress={() => navigation.navigate("QR")}
          type="font-awesome" // The icon is loaded from the font awesome icon library
          name="qrcode" // Icon fa-qrcode
          color={colorScheme === "dark" ? "white" : "black"} // White color for contrast on the Header
        />
        <View>
          <Text
            style={{
              fontSize: 30,
              color: colorScheme === "dark" ? "white" : "black",
            }}
          >
            Interclip
          </Text>
        </View>
        {Platform.OS === "ios" && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("Settings")}
          >
            <Icon
              type="font-awesome" // The icon is loaded from the font awesome icon library
              name="cog" // Icon fa-cog
              color={colorScheme === "dark" ? "white" : "black"} // White color for contrast on the Header
            />
          </TouchableOpacity>
        )}
      </Header>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Send")}>
          <Image
            style={styles.previewImg}
            source={{
              uri: imgCheck(data.result, text)
                ? `https://external.trnck.dev/api?url=${data.result}`
                : "https://raw.githubusercontent.com/aperta-principium/Interclip/master/img/interclip_logo.png",
            }}
          />
        </TouchableOpacity>
        <Input
          keyboardType={
            Platform.OS === "android" ? "email-address" : "ascii-capable"
          }
          style={{
            ...styles.container,
            color: colorScheme === "dark" ? "white" : "black",
          }}
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
              ? Linking.openURL(data.result)
              : Alert.alert(
                  `No URL set yet, make sure your code is ${config.codeMaxLength} characters long!`
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
          {!isLoading && (
            <Text
              onLongPress={() => {
                /* Handle functionality, when user presses for a longer period of time */
                try {
                  Clipboard.setString(data.result);
                  alert("Copied to Clipboard!");
                } catch (e) {
                  alert("Couldn't copy to clipboard!");
                }
              
              }}
              onPress={() => {
                Linking.openURL(data.result);
              }}
              style={{
                color: checkError(data.status)
                  ? colors.light
                  : colorScheme === "dark"
                  ? "white"
                  : colors.text,
                backgroundColor:
                  checkError(data.status) & !validationMsg(text)
                    ? colors.errorColor
                    : null,
                fontSize: 20,
              }}
            >
              {!validationMsg(text) &&
                (checkError(data.status)
                  ? "This code doesn't seem to exist 🤔"
                  : data.result)}
            </Text>
          )}
        </View>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}
