import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import { Header, Input } from 'react-native-elements';


export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [text, setText] = useState('');

    useEffect(() => {
      if(text.length === 5) {
    fetch(`http://uni.hys.cz/includes/get-api?user=${text}`)
      .then((response) => response.text())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
      }
  }, [text]);

  return (
    <View>
      <Header
        centerComponent={{
          text: 'Interclip',
          style: { color: '#fff', fontSize: 32 },
        }}
        containerStyle={{
          backgroundColor: '#333333',
          justifyContent: 'space-around',
        }}
      />

        <View>
          <Input style={styles.container}
          placeholder='Ur code here'
          maxLength={5}
          inputStyle={{fontSize: 50}}
          autoCorrect={false}
          returnKeyType={"go"}
          onChangeText={text => setText(text)}
          defaultValue={text}
          errorStyle={{ color: 'red' }}
          errorMessage='ENTER A VALID CODE HERE'
        />
      <View style={{padding: 24 }}>
        <Text>
          {text}
          </Text>
        </View>
            <View style={{ padding: 24 }}>
      {isLoading ? <ActivityIndicator/> : (
          <Text>
            {data}
          </Text>
      )}
    </View>
         <StatusBar style="auto" />
      </View>
      </View>
             
  );
}

const styles = StyleSheet.create({
  container: {
   alignItems: 'center', // Centered horizontally
   justifyContent: 'center',
   flex:1
  },
});
