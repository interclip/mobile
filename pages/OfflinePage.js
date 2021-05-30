// React, React Native imports

import React, { useEffect } from 'react';
import {
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

// Third party libraries

import NetInfo from "@react-native-community/netinfo";

// Local functions and variables

import { colors } from "../lib/Vars";
import LogoImage from "../components/LogoImage";

// Root component

export function OfflinePage({ navigation }) {
  const colorScheme = useColorScheme();

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        navigation.navigate("HomePages", {screen: "Receive a clip"});
      }
    }); 
  });

  return (
    <View
      style={{
        padding: 25,
        flex: 1,
        backgroundColor:
          colorScheme === 'dark' ? colors.darkContent : colors.lightContent,
      }}
    >
      <LogoImage />
      <Text
        style={{
          color: colorScheme === 'dark' ? 'white' : 'black',
          fontSize: 20,
          textAlign: 'center'
        }}
      >
        It looks like you&#39;re offline...
      </Text>
      <Text
        style={{
          color: colorScheme === 'dark' ? 'white' : 'black',
          marginTop: 35,
          fontSize: 14,
          textAlign: 'center'
        }}
      >
        I can&#39;t help you with that, but you can try refreshing after you&#39;re connected.
      </Text>
      <Button title="Refresh" onPress={() =>  navigation.navigate("HomePages", {screen: "Receive a clip"})} />
    </View>
  );
}
