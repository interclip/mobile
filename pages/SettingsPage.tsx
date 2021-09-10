// React, React Native imports
import React from "react";
import { Text, useColorScheme, View } from "react-native";

import { Cell, Section } from "react-native-tableview-simple";
import { Icon } from "react-native-elements";

import * as WebBrowser from "expo-web-browser";

// Local functions and variables
import { colors } from "../lib/vars";

// Import sub-pages
import FilePage from "./settings/FileSettings";
import QRSettings from "./settings/QRSettings";

// Root component

const SettingsPage: React.FC = ({ navigation }) => {
  const colorScheme = useColorScheme();

  const textColor =
    colorScheme === "dark" ? colors.lightContent : colors.darkContent;

  const sectionProps = {
    headerTextColor: colorScheme === "dark" ? colors.light : "#6d6d72",
    hideSurroundingSeparators: true,
    roundedCorners: true,
  };

  const cellProps = {
    backgroundColor: colorScheme === "dark" ? "#212121" : "#fff",
    titleTextColor: textColor,
    titleTextStyleDisabled: {
      color: colorScheme === "dark" ? "#b5b5b5" : "#808080",
    },
  };

  return (
    <View
      style={{
        paddingTop: "20%",
        padding: 20,
        flex: 1,
        backgroundColor:
          colorScheme === "dark" ? colors.darkContent : colors.lightContent,
      }}
    >
      <Text
        style={{
          fontSize: 40,
          fontWeight: "600",
          color: colorScheme === "dark" ? colors.light : colors.text,
        }}
      >
        Settings
      </Text>
      <Section header="GENERAL" {...sectionProps}>
        <Cell
          cellStyle="Basic"
          accessory="DisclosureIndicator"
          title="QR Code scanning"
          image={
            <Icon name="qr-code-outline" type="ionicon" color={textColor} />
          }
          onPress={() => navigation.navigate("SettingsPage", { screen: "QR" })}
          {...cellProps}
        />
        <Cell
          cellStyle="Basic"
          accessory="DisclosureIndicator"
          title="File upload settings"
          image={
            <Icon name="folder-outline" type="ionicon" color={textColor} />
          }
          onPress={() =>
            navigation.navigate("SettingsPage", { screen: "Files" })
          }
          {...cellProps}
        />
        <Cell
          isDisabled={true}
          cellStyle="Basic"
          accessory="DisclosureIndicator"
          title="Clipboard"
          image={
            <Icon name="clipboard-outline" type="ionicon" color={textColor} />
          }
          {...cellProps}
        />
      </Section>
      <Section header="MISCELLANEOUS" {...sectionProps}>
        <Cell
          cellStyle="Basic"
          cellAccessoryView={
            <Icon name="external-link" type="feather" color={textColor} />
          }
          title="Privacy policy"
          image={
            <Icon name="hand-left-outline" type="ionicon" color={textColor} />
          }
          onPress={() =>
            WebBrowser.openBrowserAsync("https://interclip.app/privacy")
          }
          {...cellProps}
        />
        <Cell
          cellStyle="Basic"
          accessory="DisclosureIndicator"
          title="About"
          image={
            <Icon
              name="information-circle-outline"
              type="ionicon"
              color={textColor}
            />
          }
          onPress={() =>
            navigation.navigate("SettingsPage", { screen: "About" })
          }
          {...cellProps}
        />
      </Section>
    </View>
  );
};

export { SettingsPage as default, FilePage, QRSettings };
