// React things

import * as React from "react";
import { Icon } from "react-native-elements";

/* 3rd party libraries */

import isURL from "validator/lib/isURL";
import { config } from "./Vars";
import fileTypes from "./filetypes";

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
  } else {
    return true;
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

const truncate = (text, length) => {
  if (text.length > length) {
    return `${text.substring(0, length)}...`;
  } else {
    return text.substring(0, length);
  }
};

const chooseIcon = (extension) => { 

  var fileCat = [];
  for (const key of Object.keys(fileTypes)) {
    if (fileTypes[key].includes(extension)) {
      fileCat.push(key);
      break;
    }
  }
  
  switch (fileCat[0]) {
    case "image":
      return (
        <Icon
          name="file-image"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "audio":
      return (
        <Icon
          name="file-audio"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "video":
      return (
        <Icon
          name="file-video"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "pdf":
      return (
        <Icon name="file-pdf" type="font-awesome-5" size={80} color="#367FFA" />
      );
    case "archive":
      return (
        <Icon
          name="file-archive"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );

    // JavaScript, TypeScript, CSS, SCSS, C, C#, C++, Python, HTML and many more source file types
    case "code":
      return (
        <Icon
          name="file-code"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "csv":
      return (
        <Icon name="file-csv" type="font-awesome-5" size={80} color="#367FFA" />
      );
    case "text":
      return (
        <Icon name="file-alt" type="font-awesome-5" size={80} color="#367FFA" />
      );
    // MS 365 documents: https://docs.microsoft.com/en-us/deployoffice/compat/office-file-format-reference
    case "msexcel":
      return (
        <Icon
          name="file-excel"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "mspowerpoint":
      return (
        <Icon
          name="file-powerpoint"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "msword":
      return (
        <Icon
          name="file-word"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      ); // THe default icon
    default:
      return (
        <Icon name="file" type="font-awesome-5" size={80} color="#367FFA" />
      );
  }
};

export {
  checkError,
  sleep,
  validationMsg,
  urlValidation,
  formatBytes,
  truncate,
  chooseIcon,
};
