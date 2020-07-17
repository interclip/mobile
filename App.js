import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from 'react-native-elements';


export default function App() {
  return (
    <View>
      <Header
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: 'Interclip', style: { color: '#fff', fontSize: 20 } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
        containerStyle={{
          backgroundColor: '#ff9800',
          justifyContent: 'space-around',
        }}
      />

    <View style={styles.container}>

      <Text style={{fontSize: 35 }}>Interclip</Text>
      <StatusBar style="auto" />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
