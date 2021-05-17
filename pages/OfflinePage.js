/* React, React Native imports */

import React, { useEffect } from 'react';
import {
  Image,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

/* Third party libraries */

import NetInfo from "@react-native-community/netinfo";

/* Local functions and variables */

import { colors } from '../Pages';

import {
    styles,
} from "../Pages";

/* Root component */

export function OfflinePage({ navigation }) {
  const colorScheme = useColorScheme();

  useEffect(() => {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        navigation.navigate("Home");
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
      <Image
        style={styles.aboutImg}
        source={{
          uri: 'https://raw.githubusercontent.com/aperta-principium/Interclip/main/img/interclip_logo.png',
        }}
        alt="Interclip logo"
      />
      <Text
        style={{
          color: colorScheme === 'dark' ? 'white' : 'black',
          fontSize: 20,
          textAlign: 'center'
        }}
      >
        It looks like you're offline...
      </Text>
      <Text
        style={{
          color: colorScheme === 'dark' ? 'white' : 'black',
          marginTop: 35,
          fontSize: 14,
          textAlign: 'center'
        }}
      >
        I can't help you with that, but you can try refreshing after you're connected.
      </Text>
      <Button title="Refresh" onPress={() => {navigation.navigate("Home")}} />
    </View>
  );
}
