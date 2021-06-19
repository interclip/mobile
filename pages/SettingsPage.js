// React, React Native imports

import React, { useState } from "react";
import {
  Settings,
  Switch,
  Text,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";

import { Cell, Section } from "react-native-tableview-simple";
import { Icon } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";

import * as WebBrowser from "expo-web-browser";

// Local functions and variables
import { colors } from "../lib/Vars";

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
        padding: 25,
        flex: 1,
        backgroundColor:
          colorScheme === "dark" ? colors.darkContent : colors.lightContent,
      }}
    >
      <Text
        style={{
          color: colorScheme === "dark" ? "white" : "black",
        }}
      ></Text>
      <Section header="Link opening" {...sectionProps}>
        <Cell
          cellStyle="Basic"
          title="Open non-interclip QR Codes"
          cellAccessoryView={
            <Switch
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={data}
            />
          }
          {...cellProps}
        />
      </Section>
    </View>
  );
}

export function FileSettings() {
  const [data, setData] = useState(Settings.get("uploadquality"));
  const storeData = (data) => {
    Settings.set(data);
  };

  const changeQuality = (e) => {
    setData(e);
    storeData({ uploadquality: e });
  };

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

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      color: "black",
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      color: "black",
    },
  });

  const qualityOpts = [
    {
      label: "None",
      value: 1,
    },
    {
      label: "Medium",
      value: 0.7,
    },
    {
      label: "High",
      value: 0,
    },
  ];

  return (
    <View
      style={{
        padding: 25,
        flex: 1,
        backgroundColor:
          colorScheme === "dark" ? colors.darkContent : colors.lightContent,
      }}
    >
      <Text
        style={{
          color: colorScheme === "dark" ? "white" : "black",
        }}
      ></Text>
      <Section header="File uploads" {...sectionProps}>
        <Cell
          cellStyle="Basic"
          title="Media compression"
          cellAccessoryView={
            <RNPickerSelect
              placeholder={{
                label: "Select one",
                value: null,
                color: textColor,
              }}
              items={qualityOpts}
              onValueChange={(value) => {
                changeQuality(value);
              }}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 10,
                  right: 12,
                },
              }}
              value={data}
              useNativeAndroidPickerStyle={false}
            />
          }
          {...cellProps}
        />
      </Section>
    </View>
  );
}
