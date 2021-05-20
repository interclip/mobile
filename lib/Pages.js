import {
  Dimensions,
  StyleSheet,
} from "react-native";

/* 3rd party libraries */

import isURL from 'validator/lib/isURL';
import { config, colors } from "./Vars";

/* Function and config */
export const checkError = (msg) => {
  return msg !== "success";
};

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const validationMsg = (txt) => {
  txt = txt.replace(" ", "").toLowerCase();
  const diff = config.codeLength - txt.length;
  if (txt.match(config.charRegex)) {
    return `There are some characters, that shouldn't be there.`;
  } else {
    if ((txt.length < config.codeLength) & (txt.length > 0)) {
      return `${diff} more character${diff === 1 ? "" : "s"} please`;
    } else if (txt.length === 0) {
      return `Just type in the code above and see the magic happen.`;
    }
  }
};

export const urlValidation = (url) => {
  url = encodeURI(url);

  if (url.length === 0) return "Start pasting or typing in the URL";
  if (!isURL(url)) {
    return `This doesn't seem to be a valid URL`;
  }
};

// const entireScreenHeight = Dimensions.get("window").height;
const entireScreenWidth = Dimensions.get("window").width;

/* Styles */
export const styles = StyleSheet.create({
  container: {
    alignItems: "center", // Centered horizontally
    justifyContent: "center",
    flex: 1,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  previewImg: {
    width: 100,
    height: 100,
    marginLeft: entireScreenWidth / 2 - 50,
    marginBottom: "20%",
  },
  aboutImg: {
    width: entireScreenWidth / 3,
    height:  entireScreenWidth / 3,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "10%"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  openButton: { borderRadius: 20, padding: 10, elevation: 2, marginTop: 10 },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center" },
  modalText: { marginBottom: 15, textAlign: "center" },
});

export { colors, config };