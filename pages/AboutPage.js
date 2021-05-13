/* React, React Native imports */

import React, { useState } from 'react';
import {
  Text,
  useColorScheme,
  View,
  Dimensions,
} from 'react-native';

import * as Linking from 'expo-linking';

/* Local functions and variables */

import { colors } from '../Pages';
import * as appInfo from '../app.json';

/* Root component */

export function AboutPage() {
  const [versionWidth, setVersionWidth] = useState(0);
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        padding: 25,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor:
          colorScheme === 'dark' ? colors.darkContent : colors.lightContent,
      }}
    >
      <Text
        style={{
          color: colorScheme === 'dark' ? 'white' : 'black',
        }}
      >
        Very cool stuff about Interclip
      </Text>

      <Text
        style={{
          position: 'absolute',
          bottom: '5%',
          left: Dimensions.get('window').width / 2 - versionWidth / 2,
          color: colorScheme === 'dark' ? '#D3D3D3' : 'grey',
        }}
        onLayout={(event) => setVersionWidth(event.nativeEvent.layout.width)}
        onPress={() => Linking.openURL(`https://github.com/filiptronicek/iclip-mobile/releases/tag/v${appInfo.expo.version}`)}
      >
        Interclip mobile v{appInfo.expo.version}{' '}
      </Text>
    </View>
  )
}
