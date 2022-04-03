/* 3rd party libraries */

import isURL from "validator/lib/isURL";
import { config } from "./constants";

/* Function and config */
const checkError = (msg: string): boolean => {
  return msg !== "success";
};

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const isValidClipCode = (code: string): boolean => {
  if (
    code.length < config.minimumCodeLength ||
    code.length > config.maximumCodeLength
  ) {
    return false;
  } else if (!code.match(new RegExp(/^[\dA-Za-z]{5,99}$/))) {
    return false;
  }
  return true;
};

const urlValidation = (url: string): boolean | string => {
  url = encodeURI(url);

  if (url.length === 0) return "Start pasting or typing in the URL";
  if (!isURL(url, { require_protocol: true })) {
    return `This doesn't seem to be a valid URL`;
  } else {
    return true;
  }
};

/**
 * Format bytes into a human readable format
 * @example
 * ```ts
 * formatBytes(45_000_000_000) // "41.91 GB"
 * ```
 * @param bytes the number of bytes to format
 * @param decimals the amount of decimal points
 */
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 * Makes sure a string doesn't surpass a certain length, and if it does, truncate it
 */
const truncate = (text: string, length: number): string => {
  if (text.length > length) {
    return `${text.substring(0, length)}...`;
  } else {
    return text.substring(0, length);
  }
};

export {
  checkError,
  sleep,
  isValidClipCode,
  urlValidation,
  formatBytes,
  truncate,
};
