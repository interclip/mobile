import { ClipData } from "../typings/interclip";
import { apiEndpoint } from "./constants";

/**
 * Calls the set API to create a new clip from a link
 * @param url the URL to create the clip from
 */
 export const requestClip = async (
    url: string,
    sig?: {
      signature: string;
      address?: string;
    },
  ): Promise<ClipData> => {
    const query = sig ? { url, sig: sig.signature, addr: sig.address } : { url };
    const clipResponse = await fetch(`${apiEndpoint}/api/clip/set`, {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (clipResponse.status === 500) {
      return { status: 'error', result: await clipResponse.text() };
    }
    return await clipResponse.json();
  };