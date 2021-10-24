import { Response } from "node-fetch";

type UploadActionType = "media" | "document" | "camera";

interface ClipData {
  status: "error" | "success";
  result: string;
}

interface ClipResponse extends Response {
  json: () => Promise<ClipData>;
}
