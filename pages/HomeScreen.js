import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Header, Icon, Input } from "react-native-elements";
import {
  config,
  colors,
  styles,
  imgCheck,
  ValidationMsg,
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
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#444444" : "#f4f4f4",
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
              uri: imgCheck(data, text)
                ? `https://external.iclip.trnck.dev/image?url=${data}`
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
              ? Linking.openURL(data)
              : alert(
                  `No URL set yet, make sure your code is ${config.codeMaxLength} characters long!`
                );
          }}
        />
        {ValidationMsg(text) && (
          <View style={{ padding: 24 }}>
            <Text
              style={{
                color: colorScheme === "dark" ? colors.light : colors.text,
              }}
            >
              {ValidationMsg(text)}
            </Text>
          </View>
        )}
        <View style={{ padding: 24 }}>
          {!isLoading && (
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
