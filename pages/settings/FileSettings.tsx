// React, React Native imports
import React, { useState } from "react";
import { Settings, Text, useColorScheme, View, StyleSheet } from "react-native";

import { Cell, Section } from "react-native-tableview-simple";
import RNPickerSelect from "react-native-picker-select";

// Local functions and variables
import { colors } from "../../lib/constants";

function FileSettings(): JSX.Element {
  const [data, setData] = useState(Settings.get("uploadquality"));
  const storeData = (data: Object) => {
    Settings.set(data);
  };

  const changeQuality = (e: any) => {
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
    backgroundColor: colorScheme === "dark" ? "#212121" : "#fff",
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

export default FileSettings;
