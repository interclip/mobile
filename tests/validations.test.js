import { urlValidation, isValidClipCode } from "../lib/functions";
import { test, expect } from "@jest/globals";
import { apiEndpoint } from "../lib/constants";

test("checks if Interclip's URL is a valid one", () => {
  expect(urlValidation(apiEndpoint)).toBe(true);
});

test("checks if a malformed URL is a valid one", () => {
  expect(urlValidation("//interclip.app/")).toBe(
    "This doesn't seem to be a valid URL"
  );
});

test("checks if an empty string is a valid URL", () => {
  expect(urlValidation("")).toBe("Start pasting or typing in the URL");
});

test("checks if a string with # is valid", () => {
  expect(isValidClipCode("yes#f")).toBe(false);
});

test("checks if a short code outputs correctly", () => {
  expect(isValidClipCode("haha")).toBe(false);
});

test("checks if a valid clip code is handled correctly", () => {
  expect(isValidClipCode("gamer")).toBe(true);
});

test("checks if longer clip codes are handled correctly", () => {
  expect(isValidClipCode("gamersarecoolaretheynot")).toBe(true);
});

test("checks if longer clip codes with unsupported characters are handled correctly", () => {
  expect(isValidClipCode("gamersa4recool$$$÷×aretheynot")).toBe(false);
});
