// React, React Native imports

import React, { useState } from "react";
import { Settings, Switch, Text, useColorScheme, View } from "react-native";

import { Cell, Section, TableView } from "react-native-tableview-simple";
import { Icon } from "react-native-elements";

// Local functions and variables
import { colors } from "../lib/Pages";

// Root component

export function SettingsPage({ navigation }) {
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
        marginTop: "20%",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 40,
        }}
      >
        Settings
      </Text>
      <Section header="GENERAL" roundedCorners={true}>
        <Cell
          cellStyle="Basic"
          accessory="DisclosureIndicator"
          title="QR Code scanning"
          image={
            <Icon name="qr-code-outline" type="ionicon" />
          }
        />
        <Cell
          cellStyle="Basic"
          accessory="DisclosureIndicator"
          title="Clipboard"
          image={
            <Icon name="clipboard-outline" type="ionicon" />
          }
        />
      </Section>
      <Section header="MISCELLANEOUS" roundedCorners={true}>
        <Cell
          cellStyle="Basic"
          accessory="DisclosureIndicator"
          title="About"
          image={
            <Icon name="information-circle-outline" type="ionicon" />
          }
          onPress={() => navigation.navigate("About")}
        />
      </Section>
    </View>
  );
}
