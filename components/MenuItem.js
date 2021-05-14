/* React, React Native imports */

import React from "react";
import {
  Text,
  TouchableOpacity,
} from "react-native";

/* Components, Expo and RN libraries */

import { Icon } from "react-native-elements";

import * as Haptics from 'expo-haptics';

const MenuItem = (props) => {
    return (
        <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: props.colorScheme === "dark" ? "#222" : "#ccc",
          padding: "10%",
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          props.navigation.navigate(props.destination);
          props.setPopoverOpened(false);
        }}
      >
        <Icon
          name={props.iconName}
          type={props.iconFamily}
          color={props.colorScheme === "dark" ? "white" : "black"} // White color for contrast on the Header
          style={{
            marginRight: "10%",
          }}
        />
        <Text
          style={{
            color: props.colorScheme === "dark" ? "white" : "black",
          }}
        >
          {props.title}
        </Text>
      </TouchableOpacity>
    )
};

export default MenuItem;