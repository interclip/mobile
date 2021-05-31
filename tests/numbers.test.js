import { formatBytes } from "../lib/functions";
import { test, expect } from "@jest/globals";

test("checks if Interclip's URL is a valid one", () => {
  expect(formatBytes(25)).toBe("25 Bytes");
});

test("checks if a malformed URL is a valid one", () => {
  expect(formatBytes(45000000000)).toBe("41.91 GB");
});
