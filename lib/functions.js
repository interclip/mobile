// React things

import * as React from "react";
import { Icon } from "react-native-elements";

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

  switch (extension) {
    case "jpg":
    case "png":
    case "avif":
    case "webp":
    case "ico":
    case "svg":
    case "jxl":
    case "wp2":
    case "gif":
      return (
        <Icon
          name="file-image"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "mp3":
    case "wav":
    case "flac":
    case "caf":
    case "ogg":
    case "m4a":
    case "aac":
      return (
        <Icon
          name="file-audio"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "mp4":
    case "mov":
    case "avi":
    case "webm":
    case "mkv":
    case "flv":
    case "mpv":
    case "m3u8":
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
        <Icon
          name="file-pdf"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "zip":
    case "tar":
    case "gz":
      return (
        <Icon
          name="file-archive"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );

    // JavaScript, TypeScript, CSS, SCSS, C, C#, C++, Python, HTML and many more source file types
    case "html":
    case "css":
    case "c":
    case "cs":
    case "cpp":
    case "php":
    case "py":
    case "js":
    case "jsx":
    case "tsx":
    case "ts":
    case "mjs":
    case "cjs":
    case "rb":
    case "json":
    case "java":
    case "go":
    case "r":
    case "swift":
    case "bat":
    case "sh":
    case "ps1":
    case "wasm":
      return <Icon name="file-code" type="font-awesome-5" size={80} color="#367FFA" />
    case "csv":
      return (
        <Icon name="file-csv" type="font-awesome-5" size={80} color="#367FFA" />
      );
    case "txt":
    case "log":
      return (
        <Icon name="file-alt" type="font-awesome-5" size={80} color="#367FFA" />
      );
    // MS 365 documents: https://docs.microsoft.com/en-us/deployoffice/compat/office-file-format-reference
    case "ods":
    case "xlam":
    case "xlsx":
    case "xls":
    case "xlsb":
    case "xlt":
    case "xltm":
      return (
        <Icon
          name="file-excel"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "pptx":
    case "ppt":
    case "odp":
    case "pptm":
      return (
        <Icon
          name="file-powerpoint"
          type="font-awesome-5"
          size={80}
          color="#367FFA"
        />
      );
    case "doc":
    case "docm":
    case "docx":
    case "dot":
    case "dotm":
    case "dotx":
    case "odt":
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
