// React, React Native imports

import React, { useState } from "react";
import { Text, useColorScheme, View, Dimensions, Alert } from "react-native";

import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";

import { Notifier, NotifierComponents } from "react-native-notifier";
import { useApplicationInstallTime } from "@use-expo/application";

// Local functions, components and variables

import { colors } from "../lib/vars";
import * as appInfo from "../app.json";

import { Icon } from "react-native-elements";

import LogoImage from "../components/LogoImage";

// Root component

const AboutPage: React.FC = () => {
  const [versionWidth, setVersionWidth] = useState<number>(0);
  const [installTime] = useApplicationInstallTime();

  const debugInfo = `Version: ${appInfo.expo.version} (${
    appInfo.expo.android.versionCode
  }) \nInstall time: ${installTime ? installTime.toString() : "-"}`;

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
            Linking.openURL("https://github.com/interclip/mobile/")
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
            `https://github.com/interclip/mobile/releases/tag/v${appInfo.expo.version}`
          )
        }
        onLongPress={() => {
          Alert.alert("Debug info", debugInfo, [
            {
              text: "Copy to clipboard",
              onPress: () => {
                try {
                  Clipboard.setString(debugInfo);
                  Notifier.showNotification({
                    title:
                      "All of that awesome debug stuff has been copied to your clipboard!",
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
              },
            },
            {
              text: "Cancel",
              onPress: () => console.log("No Pressed"),
              style: "cancel",
            },
          ]);
        }}
      >
        Interclip mobile v{appInfo.expo.version}{" "}
      </Text>
    </View>
  );
};

export default AboutPage;
