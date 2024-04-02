import { generateContent } from "./generateContent.js";
import RequestBody from "./types/requestBody.type";

export const handler = async (event: RequestBody) => {
  try {
    const content = await generateContent(event.duration);
    const response = {
      statusCode: 200,
      body: content,
    };
    return response;
  } catch (e) {
    const response = {
      statusCode: 500,
      error: e,
    };
    return response;
  }
};
