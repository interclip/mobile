/* 1st party libraries and dependencies: react, react native and Expo stuff */

import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Linking,
  Clipboard,
} from 'react-native';

/* 3rd party libraries */

import { Header, Input, Icon } from 'react-native-elements';

/* Function and config */
const checkError = (msg) => {
  return msg.indexOf('Error: ') > -1;
};

const ValidationMsg = (txt) => {
  txt = txt.replace(' ', '').toLowerCase();
  const diff = config.codeMaxLength - txt.length;
  if ((txt.length < config.codeMaxLength) & (txt.length > 0)) {
    return `${diff} more character${diff === 1 ? "": "s"} please`;
  } else if (txt.length === 0) {
    return `Just type in the code above and see the magic happen.`;
  } else {
    if (!txt.match(config.charRegex))
      return `There are some characters, that shouldn't be there.`;
  }
};

const config = {
  codeMaxLength: 5, // The code's length has to be always 5 characters
  charRegex: new RegExp('([a-z]|[0-9]|[A-Z]){5}'), // Only allow ascii characters to be entered as the code
};
/* Styles */
const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Centered horizontally
    justifyContent: 'center',
    flex: 1,
  },
});
/* Colors and stuff */
const colors = {
  bg: 'white',
  headerBg: '#333333',
  text: 'black',
  errorColor: '#f44336',
  light: 'white',
};

/* App component */

export default function App() {
  /* Variable set */
  const [isLoading, setLoading] = useState(true); // Loading status => only show the responce of the API after the request completes
  const [data, setData] = useState(''); // Dynamically loaded data from the Interclip REST API
  const [text, setText] = useState(''); // The code entered in the <Input>
  useEffect(() => {
    if (text.length === config.codeMaxLength) {
      setText(text.replace(' ', '').toLowerCase())
      fetch(`http://uni.hys.cz/includes/get-api?user=${text}`)
        .then((response) => response.text())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [text]);

  return (
    <View>
      <Header
        containerStyle={{
          backgroundColor: colors.headerBg,
          justifyContent: 'space-around',
        }}>
        <Icon
          onPress={() => {
            alert('QR code more like bruh-r code');
          }}
          type="font-awesome" // The icon is loaded from the font awesome icon library
          name="qrcode" // Icon fa-qrcode
          color="#fff" // White color for contrast on the Header
        />

        <Text style={{ color: 'white', fontSize: 30 }}>Interclip</Text>
      </Header>

      <View>
        <Input
          style={styles.container}
          placeholder="Your code here"
          maxLength={config.codeMaxLength}
          inputStyle={{ fontSize: 50 }}
          autoCorrect={false}
          returnKeyType={'go'}
          onChangeText={(text) => setText(text)}
          defaultValue={text}
          errorStyle={{ color: 'red' }}
          autoCapitalize="none"
          autoFocus={true}
          value={text.replace(' ', '').toLowerCase()}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={() => {
            !isLoading
              ? Linking.openURL(data)
              : alert(
                  `No URL set yet, make sure your code is ${config.codeMaxLength} characters long!`
                );
          }}
        />

        <View style={{ padding: 24 }}>
          <Text>{ValidationMsg(text)}</Text>
        </View>
        <View style={{ padding: 24 }}>
          {isLoading ? (
            <Text></Text>
          ) : (
            <Text
              onPress={() => {
                Clipboard.setString(data);
                alert('Copied to Clipboard!');
              }}
              style={{
                color: checkError(data) ? colors.light : colors.text,
                backgroundColor: checkError(data) & !ValidationMsg(text) ? colors.errorColor : null,
                fontSize: 20,
              }}>
              {!ValidationMsg(text) && (checkError(data) ? "This code doesn't seem to exist 🤔" : data)}
            </Text>
          )}
        </View>
        <StatusBar style="light" />
      </View>
    </View>
  );
}
