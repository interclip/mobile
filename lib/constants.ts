export const apiEndpoint = "https://beta.interclip.app/";
export const filesEndpoint = "https://files.interclip.app";

export const config = {
  minimumCodeLength: 5, // The code's length has to always be at least 5 characters
  maximumCodeLength: 99, // The code's length has to always be at least 5 characters
  charRegex: new RegExp("[^A-Za-z0-9]"), // Only allow ascii characters to be entered as the code
  exemptStatusCodes: [400, 404],
};

/* Colors and stuff */
export const colors = {
  bg: "white",
  headerBg: "#212121",
  text: "black",
  errorColor: "#f44336",
  light: "white",
  secondary: "#d3d3d3",
  darkHeader: "#151515",
  lightHeader: "#f4f4f4",
  darkContent: "#151515",
  lightContent: "#f4f4f4",
};

export const inputProps = {
  enablesReturnKeyAutomatically: true,
  errorStyle: { color: "red" },
  importantForAutofill: "no",
  autoCapitalize: "none",
  autoCorrect: false,
  returnKeyType: "go",
};
