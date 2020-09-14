import React, { useState } from "react";
import { Settings, Switch, Text, useColorScheme, View } from "react-native";
import { styles } from "../Pages";

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
