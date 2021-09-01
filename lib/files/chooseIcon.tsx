// React things

import * as React from "react";
import { Icon } from "react-native-elements";

import fileTypes from "./filetypes";

const chooseIcon = (extension: string) => {
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

export default chooseIcon;
