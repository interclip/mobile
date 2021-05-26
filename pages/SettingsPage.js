// React, React Native imports

import React, { useState } from "react";
import { Settings, Switch, Text, useColorScheme, View } from "react-native";

import { Cell, Section } from "react-native-tableview-simple";
import { Icon } from "react-native-elements";

// Local functions and variables
import { colors } from "../lib/Pages";

// Root component

export function SettingsPage({ navigation }) {
  const colorScheme = useColorScheme();
  const textColor =
    colorScheme === "dark" ? colors.lightContent : colors.darkContent;

  const sectionProps = {
    headerTextColor: colorScheme === "dark" ? colors.light : "#6d6d72",
    hideSurroundingSeparators: true,
    roundedCorners: true,
  };

  const cellProps = {
    backgroundColor: colorScheme === "dark" ? "#373737" : "#FFF",
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
          isDisabled={true}
          accessory="DisclosureIndicator"
          title="Privacy policy"
          image={
            <Icon
              name="hand-left-outline"
              type="ionicon"
              color={textColor}
            />
          }
          onPress={() =>
            navigation.navigate("SettingsPage", { screen: "About" })
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
}

export function QRSettings() {
  const [data, setData] = useState(Settings.get("data"));
  const storeData = (data) => {
    Settings.set(data);
  };

  const toggleSwitch = (e) => {
    setData(e);
    storeData({ data: e });
  };

  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        padding: 25,
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor:
          colorScheme === "dark" ? colors.darkContent : colors.lightContent,
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
