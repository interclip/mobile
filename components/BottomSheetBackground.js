// React, React Native imports

import React, { useMemo } from "react";

import { useColorScheme } from "react-native";

import PropTypes from "prop-types";

// Components, Expo and RN libraries

import Animated, { interpolateColors } from "react-native-reanimated";

const CustomBackground = ({ animatedIndex, style }) => {
  const colorScheme = useColorScheme();

  // animated variables
  const animatedBackground = useMemo(
    () =>
      interpolateColors(animatedIndex, {
        inputRange: [0, 1],
        outputColorRange:
          colorScheme === "dark" ? ["#333", "#404040"] : ["#fff", "#fff"],
      }),
    [animatedIndex]
  );

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: animatedBackground,
      },
    ],
    [style, animatedBackground]
  );

  return <Animated.View style={containerStyle} />;
};

CustomBackground.propTypes = {
  animatedIndex: PropTypes.any.isRequired,
  style: PropTypes.any.isRequired,
};

export default CustomBackground;