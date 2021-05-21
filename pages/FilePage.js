// React, React Native imports 

import React, { useState } from 'react';
import {
    Text,
    useColorScheme,
    View,
    Button,
    Alert
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';

// Local functions, components and variables 

import { colors, styles } from '../lib/Pages';

import fetch from 'node-fetch';

// Root component

export function FilePage() {
    const colorScheme = useColorScheme();

    const [fileURL, setFileURL] = useState("");
    const [data, setData] = useState({ result: "" }); // Dynamically loaded data from the Interclip REST API

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
            <View

            >
                <Button
                    title="Choose a file"
                    style={{
                        textAlign: 'center'
                    }}
                    onPress={() => {
                        (async () => {
                            const res = await DocumentPicker.getDocumentAsync();
                            console.log(res);
                            const data = new FormData();
                            data.append('uploaded_file', res);

                            fetch(
                                'https://interclip.app/upload/?api', //upload/?api
                                {
                                    method: 'post',
                                    body: data,
                                    headers: {
                                        'Content-Type': 'multipart/form-data;',
                                    },
                                }
                            ).then((res) => res.json()).then(response => {
                                console.log(response);
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
                            });
                        })();
                    }} />
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
                        { fileURL && "Uploaded file to" }
                    </Text>
                    <Text
                        style={{
                            fontSize: 25,
                            color: colorScheme === 'dark' ? 'white' : 'black',
                            ...styles.fileItem
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
                        { fileURL && "with code" }
                    </Text>
                    <Text
                        style={{
                            fontSize: 45,
                            color: colorScheme === 'dark' ? 'white' : 'black',
                            ...styles.fileItem
                        }}
                    >
                        {data.result}
                    </Text>
                </View>
            </View>
        </View>
    );
}
