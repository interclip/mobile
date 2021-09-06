// React, React Native imports
import React, { useState } from "react";
import { Settings, Switch, Text, useColorScheme, View } from "react-native";

import { Cell, Section } from "react-native-tableview-simple";

// Local functions and variables
import { colors } from "../../lib/vars";

// Root component

function QRSettings(): JSX.Element {
  const [data, setData] = useState(Settings.get("data"));
  const storeData = (data: Object) => {
    Settings.set(data);
  };

  const toggleSwitch = (e: string | boolean | number | BigInt) => {
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
    backgroundColor: colorScheme === "dark" ? "#212121" : "#fff",
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

export default QRSettings;
