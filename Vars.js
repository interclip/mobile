export const config = {
    codeMaxLength: 5, // The code's length has to be always 5 characters
    charRegex: new RegExp("[^A-Za-z0-9]"), // Only allow ascii characters to be entered as the code
};

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
