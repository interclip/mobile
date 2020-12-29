import {
  Dimensions,
  StyleSheet,
} from "react-native";

/* 3rd party libraries */

import { isURL } from "./functions";

/* Function and config */
export const checkError = (msg) => {
  return msg !== "success";
};

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const imgCheck = (url, inval) => {
  if (inval === "") return false;
  if (typeof url !== "string") return false;
  return !!url.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi);
};

export const validationMsg = (txt) => {
  txt = txt.replace(" ", "").toLowerCase();
  const diff = config.codeMaxLength - txt.length;
  if (txt.match(config.charRegex)) {
    return `There are some characters, that shouldn't be there.`;
  } else {
    if ((txt.length < config.codeMaxLength) & (txt.length > 0)) {
      return `${diff} more character${diff === 1 ? "" : "s"} please`;
    } else if (txt.length === 0) {
      return `Just type in the code above and see the magic happen.`;
    }
  }
};

export const urlValidation = (url) => {
  url = url.split(" ").join("%20");
  url = url.split("<").join("&gt;");
  url = url.split(">").join("&lt;");

  if (url.length === 0) return "Start pasting or typing in the URL";
  if (!isURL(url)) {
    return `This doesn't seem to be a valid URL`;
  }
};

// const entireScreenHeight = Dimensions.get("window").height;
const entireScreenWidth = Dimensions.get("window").width;

export const config = {
  codeMaxLength: 5, // The code's length has to be always 5 characters
  charRegex: new RegExp("[^A-Za-z0-9]"), // Only allow ascii characters to be entered as the code
};

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

/* Colors and stuff */
export const colors = {
  bg: "white",
  headerBg: "#444444",
  text: "black",
  errorColor: "#f44336",
  light: "white",
  darkHeader: "#333333",
  lightHeader: "#f4f4f4",
  darkContent: "#444444",
  lightContent: "#f4f4f4",
};
