// React, React Native imports

import React, { useState } from "react";
import {
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";

import ActionSheet from "rn-actionsheet-module";

import Clipboard from "expo-clipboard";

import * as Linking from "expo-linking";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

// Local functions, components and variables

import { colors, styles, formatBytes } from "../lib/Pages";

import fetch from "node-fetch";

// Root component

export function FilePage() {
  const colorScheme = useColorScheme();

  const [fileURL, setFileURL] = useState("");
  const [data, setData] = useState({ result: "" }); // Dynamically loaded data from the Interclip REST API
  const [loading, setLoading] = useState(false);

  const chooseAction = () => {
    ActionSheet(
      {
        title: "Select the source of your file",
        optionsIOS: ["Cancel", "From Gallery", "From Documents"],
        optionsAndroid: ["From Gallery", "From Documents"],
        destructiveButtonIndex: null, // undefined // 1, 2, etc.,
        cancelButtonIndex: 0,
        onCancelAndroidIndex: 3, // Android doesn't need any cancel option but back button or outside click will return onCancelAndroidIndex
      },
      (index) => {
        let action;
        switch (index) {
          case Platform.OS === "ios" ? 1 : 0:
            action = "media";
            break;
          case Platform.OS === "ios" ? 2 : 1:
            action = "document";
            break;

          case Platform.OS === "ios" ? 0 : 3:
            action = null;
            break;

          default:
            alert("Default");
            break;
        }

        if (action !== null) {
          upload(action);
        }
      }
    );
  };

  const upload = async (action = "media") => {
    let file;
    if (action === "media") {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera roll is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
      });

      if (pickerResult.cancelled === true) {
        file = null;
      }

      file = pickerResult;
    } else if (action === "document") {
      const res = await DocumentPicker.getDocumentAsync();
      if (res.type !== "cancel") {
        file = res;
      } else {
        file = null;
      }
    }

    if (file !== null) {
      // Set defaults for subsequent uploads

      setLoading(true);
      setFileURL("");
      setData({ result: "" });

      const uri = file.uri;
      const extension = uri.split(".")[uri.split(".").length - 1];

      const fileSizeLimitInMegabytes = 100;
      const fileSizeLimitInBytes = fileSizeLimitInMegabytes * 1048576;

      let blob = file;

      if (action === "media") {
        blob = await (await fetch(uri)).blob();
      }

      if (blob.size > fileSizeLimitInBytes) {
        Alert.alert(
          `File size limit exceeded, your file has ${formatBytes(
            blob.size
          )}, but the limit is ${fileSizeLimitInMegabytes}`
        );
        setLoading(false);
      } else {
        const data = new FormData();

        data.append("uploaded_file", {
          uri,
          type: blob.type,
          name: `media.${extension}`,
        });

        fetch("https://interclip.app/upload/?api", {
          method: "post",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data;",
          },
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              Alert.alert("Error!", `Got the error ${res.status}.`);
            }
          })
          .then((response) => {
            setFileURL(response.result);

            fetch(`https://interclip.app/includes/api?url=${response.result}`)
              .then((rs) => {
                if (rs.ok) {
                  return rs.json();
                } else {
                  if (rs.status === 429) {
                    Alert.alert(
                      "Slow down!",
                      "We are getting too many requests from you."
                    );
                  } else {
                    Alert.alert("Error!", `Got the error ${rs.status}.`);
                  }
                }
              })
              .then((objson) => setData(objson))
              .finally(() => setLoading(false));
          });
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -100,
        backgroundColor:
          colorScheme === "dark" ? colors.darkContent : colors.lightContent,
      }}
    >
      <View>
        {loading ? (
          <View>
            <ActivityIndicator />
            <Text
              style={{
                color: colorScheme === "dark" ? "white" : "black",
                fontSize: 20,
                marginTop: 20,
                textAlign: "center",
              }}
            >
              Uploading...
            </Text>
          </View>
        ) : (
          <Button
            title="Choose a file"
            style={{
              textAlign: "center",
            }}
            onPress={() => chooseAction()}
          />
        )}
        <Text
          style={{
            color: colorScheme === "dark" ? "white" : "black",
            fontSize: 20,
            textAlign: "center",
          }}
        ></Text>
        <View>
          <Text
            style={{
              fontSize: 20,
              color: colorScheme === "dark" ? "white" : "black",
              ...styles.fileItem,
            }}
          >
            {fileURL && "Uploaded file to"}
          </Text>
          <Text
            style={{
              fontSize: 25,
              color: colorScheme === "dark" ? "white" : "black",
              ...styles.fileItem,
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
              color: colorScheme === "dark" ? "white" : "black",
              ...styles.fileItem,
            }}
          >
            {fileURL && "with code"}
          </Text>
          <Text
            style={{
              fontSize: 45,
              color: colorScheme === "dark" ? "white" : "black",
              ...styles.fileItem,
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
