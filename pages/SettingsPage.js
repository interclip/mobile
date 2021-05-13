/* React, React Native imports */

import React, { useState } from 'react';
import {
  Settings,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';

/* Local functions and variables */

import { colors } from '../Pages';

/* Root component */

export function SettingsPage() {
  const [isEnabled, setIsEnabled] = useState();

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    storeData({ data: isEnabled });
  };

  const [data, setData] = useState(Settings.get('data'));
  const storeData = (data) => {
    data.data = !data.data;
    Settings.set(data);
    setData(Settings.get('data'));
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
  )
}
