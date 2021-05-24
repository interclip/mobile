// React, React Native imports

import React, { useState } from 'react';
import {
  Settings,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';

// Local functions and variables

import { colors } from '../lib/Pages';

// Root component

export function SettingsPage() {

  const [data, setData] = useState(Settings.get('data'));
  const storeData = (data) => {
    Settings.set(data);
  };

  const toggleSwitch = (e) => {
    setData(e);
    storeData({ data: e });
  };

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
        Open all QR Codes automatically
      </Text>
      <Switch
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={data}
      />
    </View>
  );
}
