import { Response } from "node-fetch";

type UploadActionType = "media" | "document" | "camera";

interface ErrorResponse {
  status: "error";
  /**
   * The error message to be displayed
   */
  result: string;
  code?: number;
}

interface SuccessResponse<T> {
  status: "success";
  result: T;
}

type ClipData = ErrorResponse | SuccessResponse<string>;

interface ClipResponse extends Response {
  json: () => Promise<ClipData>;
}
