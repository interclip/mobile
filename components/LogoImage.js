/* React, React Native imports */

import React from "react";
import { Image } from "react-native";

import { styles } from "../lib/Pages";

const LogoImage = () => {
  return (
    <Image
      style={styles.aboutImg}
      source={require("../assets/icon.png")}
      alt="Interclip logo"
    />
  );
};

export default LogoImage;
