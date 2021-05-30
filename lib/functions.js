/* 3rd party libraries */

import isURL from "validator/lib/isURL";
import { config } from "./Vars";

/* Function and config */
const checkError = (msg) => {
  return msg !== "success";
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const validationMsg = (txt) => {
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

const urlValidation = (url) => {
  url = encodeURI(url);

  if (url.length === 0) return "Start pasting or typing in the URL";
  if (!isURL(url, { require_protocol: true })) {
    return `This doesn't seem to be a valid URL`;
  }
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export { checkError, sleep, validationMsg, urlValidation, formatBytes };
