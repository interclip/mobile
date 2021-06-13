import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Animated from 'react-native-reanimated';

const Handle = () => {
  const colorScheme = useColorScheme();
  return (
    <Animated.View style={styles.header}>
      <Animated.View style={{...styles.indicator, backgroundColor: colorScheme === "dark" ? "white" : "rgba(0, 0, 0, 0.75)" }} />
    </Animated.View>
  );
};

export default Handle;

const styles = StyleSheet.create({
  header: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  indicator: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: "7%",
    height: 4,
    borderRadius: 4,
  },
});