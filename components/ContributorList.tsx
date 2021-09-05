// React, React Native imports

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from "react-native";

import * as Linking from "expo-linking";
import { Image } from "react-native-elements";

import { colors } from "../lib/vars";

type contributorType = {
  login: string;
  type: "Bot" | "User" | "Organization";
};

const ContributorList = () => {
  const [contributors, setContributors] = useState(["interclip"]);
  const colorScheme = useColorScheme();

  // Fetch the contributors from the GitHub API
  useEffect(() => {
    fetch("https://api.github.com/repos/interclip/mobile/contributors")
      .then((response) => response.json())
      .then((responseJson) => {
        const exemptUsers = ["restyled-commits", "codacy-badger"];
        const contributorLogins = responseJson
          .filter(
            (contributor: contributorType) =>
              contributor.type !== "Bot" &&
              !exemptUsers.includes(contributor.login)
          )
          .map((contributor: contributorType) => contributor.login);
        setContributors(contributorLogins);
      })
      .catch((_error) => {
        Alert.alert(
          "Error",
          "There was an error fetching the contributors. Please try again later."
        );
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
        Made by:{" "}
      </Text>
      {contributors.map((contributor) => {
        return (
          <Image
            key={contributor}
            onPress={() => Linking.openURL(`https://github.com/${contributor}`)}
            source={{
              uri: `https://github.com/${contributor}.png`,
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
