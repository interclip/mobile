import { validationMsg, urlValidation } from "../lib/functions";
import { test, expect } from "@jest/globals";

test("checks if Interclip's URL is a valid one", () => {
  expect(urlValidation("https://interclip.app/")).toBe(true);
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
  expect(validationMsg("yes#f")).toBe(
    "There are some characters, that shouldn't be there."
  );
});

test("checks if a short code outputs correctly", () => {
  expect(validationMsg("task")).toBe("1 more character please");
});
