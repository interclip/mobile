// React, React Native imports

import React, { useState } from "react";
import {
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
  Platform,
  Dimensions,
  Settings,
} from "react-native";

import { Button, Icon } from "react-native-elements";
import BottomSheet from "react-native-bottomsheet";
import { Notifier, NotifierComponents } from "react-native-notifier";

import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

// Local functions, components and variables
import { apiEndpoint, colors, filesEndpoint } from "../lib/constants";
import { formatBytes } from "../lib/functions";
import { styles } from "../lib/pages";
import { ClipData, ClipResponse, UploadActionType } from "../typings/interclip";

import fetch from "node-fetch";
import { APIError } from "./APIError";
import { convertXML } from "simple-xml-to-json";
import { requestClip } from "../lib/requestClip";

const FilePage: React.FC = () => {
  const colorScheme = useColorScheme();

  const [fileURL, setFileURL] = useState<string>("");
  // Dynamically loaded data from the Interclip REST API
  const [data, setData] = useState<ClipData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const upload = async (action: UploadActionType = "media") => {
    let file;
    if (action === "media") {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Notifier.showNotification({
          title: "Permission to access the camera roll is required!",
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        });
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
      });

      file = pickerResult.cancelled ? null : pickerResult;
    } else if (action === "document") {
      const res = await DocumentPicker.getDocumentAsync();
      if (res.type !== "cancel") {
        file = res;
      } else {
        file = null;
      }
    } else if (action === "camera") {
      const permissionResult = await ImagePicker.getCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Notifier.showNotification({
          title: "Permission to access the camera is required!",
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        });
        return;
      }

      const pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality:
          Settings.get("uploadquality") === null
            ? 0
            : Settings.get("uploadquality"),
      });

      file = pickerResult.cancelled ? null : pickerResult;
    }

    if (file !== null) {
      // Set defaults for subsequent uploads

      setLoading(true);
      setFileURL("");
      setData(null);

      const uri: string = file.uri;
      const extension: string = uri.slice(
        ((uri.lastIndexOf(".") - 1) >>> 0) + 2
      );

      const fileSizeLimitInMegabytes = 100;
      const fileSizeLimitInBytes = fileSizeLimitInMegabytes * 1048576;

      let blob = file;

      if (action === "media") {
        blob = await (await fetch(uri)).blob();
      }

      if (blob.size > fileSizeLimitInBytes) {
        Notifier.showNotification({
          title: `File size limit exceeded, your file has ${formatBytes(
            blob.size
          )}, but the limit is ${fileSizeLimitInMegabytes} MB`,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        });
        setLoading(false);
      } else {
        const fileType = encodeURIComponent((blob as Blob).type);
        const fileName = `media.${extension}`;

        const res = await fetch(
          `${apiEndpoint}api/uploadFile?name=${fileName}&type=${fileType}`
        );

        try {
          if (!res.ok) {
            switch (res.status) {
              case 404:
                throw new APIError("API Endpoint not found");
              case 500:
                throw new APIError("Generic fail");
              case 503:
                throw new APIError((await res.json()).result);
            }

            throw new APIError(await res.text());
          }

          const { url, fields } = await res.json();
          const formData = new FormData();
          // eslint-disable-next-line unicorn/no-array-for-each
          Object.entries({ ...fields, file }).forEach(
            ([key, value]: [key: string, value: any]) => {
              formData.append(key, value);
            }
          );
          const upload = await fetch(url, {
            method: "POST",
            //@ts-ignore
            body: formData,
          });

          let fileURL;

          if (upload.ok) {
            fileURL = `${filesEndpoint}/${fields.key}`;
            setFileURL(fileURL);
          } else {
            const plainText = await upload.text();
            const jsonResponse = convertXML(plainText);
            const erorrMsg = jsonResponse.Error.children[0].Code.content;

            switch (erorrMsg) {
              case "EntityTooLarge":
                const fileSize =
                  jsonResponse.Error.children[2].ProposedSize.content;
                throw new APIError(`File too large (${formatBytes(fileSize)})`);
              case "AccessDenied":
                throw new APIError("Access Denied to the bucket");
              default:
                throw new APIError("Upload failed.");
            }
          }

          const codeRequest = await requestClip(fileURL);

          if (codeRequest.status === "error") {
            throw new APIError(`Clip creation failed: ${codeRequest.result}`);
          }

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setData(codeRequest);
        } catch (error) {
          if (error instanceof APIError) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Notifier.showNotification({
              title: `Got the error ${error.message}`,
              Component: NotifierComponents.Alert,
              componentProps: {
                alertType: "error",
              },
            });
          }
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const chooseAction = () => {
    if (Platform.OS === "ios") {
      Haptics.selectionAsync();
      BottomSheet.showBottomSheetWithOptions(
        {
          options: ["Cancel", "From Gallery", "From Documents", "From Camera"],
          title: "Select the source of your file",
          cancelButtonIndex: 0,
        },
        (index) => {
          let action: UploadActionType;
          switch (index) {
            case Platform.OS === "ios" ? 1 : 0:
              action = "media";
              break;
            case Platform.OS === "ios" ? 2 : 1:
              action = "document";
              break;

            case Platform.OS === "ios" ? 3 : 2:
              action = "camera";
              break;

            case Platform.OS === "ios" ? 0 : 3:
              action = null;
              break;
          }

          if (action !== null) {
            upload(action);
          }
        }
      );
    } else {
      upload();
    }
  };

  const { width } = Dimensions.get("window");

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
            buttonStyle={{
              //@ts-ignore
              textAlign: "center",
              backgroundColor: "#367FFA",
              paddingLeft: width * 0.15,
              paddingRight: width * 0.15,
              paddingTop: width * 0.05,
              paddingBottom: width * 0.05,
              borderRadius: 10,
            }}
            titleStyle={{
              fontWeight: "500",
            }}
            icon={
              <Icon
                name="images"
                type="ionicon"
                color="white"
                style={{
                  paddingRight: 15,
                }}
                tvParallaxProperties={undefined}
              />
            }
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
                Notifier.showNotification({
                  title: "The URL has been copied to your clipboard!",
                  Component: NotifierComponents.Alert,
                  componentProps: {
                    alertType: "success",
                  },
                });
              } catch (e) {
                Notifier.showNotification({
                  title: "Couldn't copy to clipboard!",
                  Component: NotifierComponents.Alert,
                  componentProps: {
                    alertType: "error",
                  },
                });
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
                if (data.status === "success") {
                  Clipboard.setString(
                    data.result.code.slice(0, data.result.hashLength)
                  );
                  Notifier.showNotification({
                    title: "The file code has been copied to your clipboard!",
                    Component: NotifierComponents.Alert,
                    componentProps: {
                      alertType: "success",
                    },
                  });
                }
              } catch (e) {
                Notifier.showNotification({
                  title: "Couldn't copy to clipboard!",
                  Component: NotifierComponents.Alert,
                  componentProps: {
                    alertType: "error",
                  },
                });
              }
            }}
          >
            {data &&
              data.status === "success" &&
              data.result.code.slice(0, data.result.hashLength)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FilePage;
