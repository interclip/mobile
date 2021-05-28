// React, React Native imports

import React, { useState } from "react";
import { Text, useColorScheme, View, Dimensions } from "react-native";

import * as Linking from "expo-linking";

// Local functions, components and variables

import { colors } from "../lib/Pages";
import * as appInfo from "../app.json";

import { Icon } from "react-native-elements";

import LogoImage from "../components/LogoImage";

// Root component

export function AboutPage() {
  const [versionWidth, setVersionWidth] = useState(0);
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        padding: 25,
        flex: 1,
        backgroundColor:
          colorScheme === "dark" ? colors.darkContent : colors.lightContent,
        paddingTop: "10%",
      }}
    >
      <LogoImage />
      <Text
        style={{
          color: colorScheme === "dark" ? "white" : "black",
          fontSize: 20,
          textAlign: "center",
        }}
      >
        Interclip mobile is the mobile companion to Interclip, an awesome tool
        for sharing URLs and files cross-device and cross-platform
      </Text>
      <View
        style={{
          display: "flex",
          marginTop: "10%",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Icon
          onPress={() =>
            Linking.openURL("https://github.com/filiptronicek/iclip-mobile/")
          }
          type="font-awesome" // The icon is loaded from the font awesome icon library
          name="github" // Icon fa-github
          color={colorScheme === "dark" ? "white" : "black"} // White color for contrast on the Header
          size={50}
        />
        <Icon
          onPress={() => Linking.openURL("https://twitter.com/filiptronicek")}
          type="font-awesome" // The icon is loaded from the font awesome icon library
          name="twitter" // Icon fa-twitter
          color={colorScheme === "dark" ? "white" : "black"} // White color for contrast on the Header
          size={50}
        />
      </View>
      <Text
        style={{
          position: "absolute",
          bottom: "5%",
          left: Dimensions.get("window").width / 2 - versionWidth / 2,
          color: colorScheme === "dark" ? colors.secondary : "grey",
        }}
        onLayout={(event) => setVersionWidth(event.nativeEvent.layout.width)}
        onPress={() =>
          Linking.openURL(
            `https://github.com/filiptronicek/iclip-mobile/releases/tag/v${appInfo.expo.version}`
          )
        }
      >
        Interclip mobile v{appInfo.expo.version}{" "}
      </Text>
    </View>
  );
}
