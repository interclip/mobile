import React, { useState, useEffect } from "react";
import { Text, View, ActivityIndicator, useColorScheme } from "react-native";

import * as Linking from "expo-linking";
import { Image } from "react-native-elements";
import { Notifier, NotifierComponents } from "react-native-notifier";

import { colors } from "../lib/constants";
import { proxied } from "../lib/image";

type Contributor = {
  login: string;
  type: "Bot" | "User" | "Organization";
  avatar_url: string;
  html_url: string;
};

const ContributorList = () => {
  const [contributors, setContributors] = useState<Contributor[]>([
    {
      login: "interclip",
      type: "User",
      avatar_url: proxied(
        "https://avatars.githubusercontent.com/u/87187104?v=4"
      ),
      html_url: "https://github.com/interclip",
    },
  ]);
  const colorScheme = useColorScheme();

  // Fetch the contributors from the GitHub API
  useEffect(() => {
    fetch("https://api.github.com/repos/interclip/mobile/contributors")
      .then((response) => {
        // Check for errors
        if (!response.ok) {
          Notifier.showNotification({
            title: "Sheeesh",
            description: `Encountered an error while fetching contributors: (${response.status})`,
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: "error",
            },
          });
          return [{ login: "interclip", type: "Bot" }];
        }
        return response.json();
      })
      .then((responseJson: Contributor[]) => {
        const exemptUsers = ["restyled-commits", "codacy-badger"];
        const contributorLogins = responseJson.filter(
          (contributor: Contributor) =>
            contributor.type !== "Bot" &&
            !exemptUsers.includes(contributor.login)
        );
        setContributors(contributorLogins);
      })
      .catch((_error) => {
        Notifier.showNotification({
          title: "Error",
          description:
            "There was an error fetching the contributors. Please try again later.",
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "error",
          },
        });
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color:
            colorScheme === "dark" ? colors.lightContent : colors.darkContent,
        }}
      >
        {contributors.length > 0 ? "Made by: " : ""}
      </Text>
      {contributors.map((contributor) => {
        return (
          <Image
            key={contributor.login}
            onPress={() => Linking.openURL(contributor.html_url)}
            source={{
              uri: proxied(contributor.avatar_url, 30, 30),
            }}
            style={{
              width: 35,
              height: 35,
              borderRadius: 25,
              margin: 5,
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "white" : "gray",
            }}
            PlaceholderContent={<ActivityIndicator />}
          />
        );
      })}
    </View>
  );
};

export default ContributorList;
