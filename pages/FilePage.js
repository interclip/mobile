// React, React Native imports 

import React, { useState } from 'react';
import {
    Text,
    useColorScheme,
    View,
    Button,
    Alert,
    ActivityIndicator
} from 'react-native';

import Clipboard from 'expo-clipboard';

import * as Linking from 'expo-linking';

//import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

// Local functions, components and variables 

import { colors, styles } from '../lib/Pages';

import fetch from 'node-fetch';

// Root component

export function FilePage() {
    const colorScheme = useColorScheme();

    const [fileURL, setFileURL] = useState("");
    const [data, setData] = useState({ result: "" }); // Dynamically loaded data from the Interclip REST API
    const [loading, setLoading] = useState(false);

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -100,
                backgroundColor:
                    colorScheme === 'dark' ? colors.darkContent : colors.lightContent,
            }}
        >
            <View>
                {loading ?
                    <View>
                        <ActivityIndicator />
                        <Text
                            style={{
                                color: colorScheme === 'dark' ? 'white' : 'black',
                                fontSize: 20,
                                marginTop: 20,
                                textAlign: 'center'
                            }}
                        >
                            Uploading...
                        </Text>
                    </View>
                    :
                    <Button
                        title="Choose a file"
                        style={{
                            textAlign: 'center'
                        }}
                        onPress={() => {
                            (async () => {
                                const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

                                if (permissionResult.granted === false) {
                                    Alert.alert('Permission to access camera roll is required!');
                                    return;
                                }

                                const pickerResult = await ImagePicker.launchImageLibraryAsync();
                                if (pickerResult.cancelled === true) {
                                    return;
                                }

                                // Set defaults for subsequent uploads

                                setLoading(true);
                                setFileURL("");
                                setData({result: ""});

                                const uri = pickerResult.uri;
                                const extension = uri.split(".")[uri.split(".").length - 1];

                                const blob = await (await fetch(uri)).blob();

                                const data = new FormData();

                                data.append('uploaded_file', {
                                    uri: pickerResult.uri, type: blob.type, name: `image.${extension}`
                                });

                                fetch(
                                    'https://interclip.app/upload/?api',
                                    {
                                        method: 'post',
                                        body: data,
                                        headers: {
                                            'Content-Type': 'multipart/form-data;',
                                        },
                                    }
                                ).then((res) => res.json()).then((response) => {
                                    setFileURL(response.result);

                                    fetch(`https://interclip.app/includes/api?url=${response.result}`)
                                        .then((rs) => {
                                            if (rs.ok) {
                                                return rs.json();
                                            } else {
                                                if (rs.status === 429) {
                                                    Alert.alert("Slow down!", "We are getting too many requests from you.");
                                                } else {
                                                    Alert.alert("Error!", `Got the erorr ${rs.status}.`);
                                                }
                                            }
                                        })
                                        .then((objson) => setData(objson))
                                        .finally(() => setLoading(false));
                                });

                            })();
                        }} />
                }
                <Text
                    style={{
                        color: colorScheme === 'dark' ? 'white' : 'black',
                        fontSize: 20,
                        textAlign: 'center'
                    }}
                >

                </Text>
                <View>
                    <Text
                        style={{
                            fontSize: 20,
                            color: colorScheme === 'dark' ? 'white' : 'black',
                            ...styles.fileItem
                        }}
                    >
                        {fileURL && "Uploaded file to"}
                    </Text>
                    <Text
                        style={{
                            fontSize: 25,
                            color: colorScheme === 'dark' ? 'white' : 'black',
                            ...styles.fileItem
                        }}
                        onPress={() => Linking.openURL(fileURL)}
                        onLongPress={() => {
                            /* Handle functionality, when user presses for a longer period of time */
                            try {
                                Clipboard.setString(fileURL);
                                Alert.alert("Success", "Copied to Clipboard!");
                            } catch (e) {
                                Alert.alert("Error", "Couldn't copy to clipboard!");
                            }
                        }}
                    >
                        {fileURL}
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            color: colorScheme === 'dark' ? 'white' : 'black',
                            ...styles.fileItem
                        }}
                    >
                        {fileURL && "with code"}
                    </Text>
                    <Text
                        style={{
                            fontSize: 45,
                            color: colorScheme === 'dark' ? 'white' : 'black',
                            ...styles.fileItem
                        }}
                        onLongPress={() => {
                            /* Handle functionality, when user presses for a longer period of time */
                            try {
                                Clipboard.setString(data.result);
                                Alert.alert("Success", "Copied to Clipboard!");
                            } catch (e) {
                                Alert.alert("Error", "Couldn't copy to clipboard!");
                            }
                        }}
                    >
                        {data.result}
                    </Text>
                </View>
            </View>
        </View>
    );
}
