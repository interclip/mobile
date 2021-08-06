import React from "react";
import { useColorScheme } from "react-native";
import Animated from "react-native-reanimated";

import { styles } from "../lib/pages";

const Handle = () => {
  const colorScheme = useColorScheme();
  return (
    <Animated.View style={styles.header}>
      <Animated.View
        style={{
          ...styles.indicator,
          backgroundColor:
            colorScheme === "dark" ? "white" : "rgba(0, 0, 0, 0.75)",
        }}
      />
    </Animated.View>
  );
};

export default Handle;
