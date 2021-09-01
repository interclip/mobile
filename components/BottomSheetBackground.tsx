// React, React Native imports

import React, { useMemo } from "react";

import { useColorScheme } from "react-native";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";

import PropTypes from "prop-types";

// Components, Expo and RN libraries

/*
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
*/

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const colorScheme = useColorScheme();

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      colorScheme === "dark" ? ["#333", "#404040"] : ["#fff", "#fff"]
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

CustomBackground.propTypes = {
  animatedIndex: PropTypes.any.isRequired,
  style: PropTypes.any.isRequired,
};

export default CustomBackground;
