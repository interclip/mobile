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

import { colors } from '../lib/Pages';
import LogoImage from "../components/LogoImage";

import fetch from 'node-fetch';

// Root component

export function FilePage() {
    const colorScheme = useColorScheme();

    const [fileURL, setFileURL] = useState("https://files.interclip.app/643e027852.pdf");
    const [data, setData] = useState({result: "codea"}); // Dynamically loaded data from the Interclip REST API

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
                <Button title="Choose a file" onPress={() => {
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
            </Text>
            <View
                style={{
                    marginTop: 45,
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    Uploaded file to
                </Text>
                <Text
                style={{
                    fontSize: 25,
                    marginLeft: "auto",
                    marginRight: "auto",
                    textAlign: "center"
                }}
                >
                    {fileURL}
                </Text>
                <Text
                style={{
                    fontSize: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
                >
                    with code
                </Text>
                <Text
                style={{
                    fontSize: 45,
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
                >
                    {data.result}
                </Text>
            </View>
        </View>
    );
}
