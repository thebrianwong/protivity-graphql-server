import {
  GenerateContentRequest,
  GenerateContentResponse,
  HarmBlockThreshold,
  HarmCategory,
} from "@google-cloud/vertexai";
import "dotenv/config";
import "google-auth-library";
import { GoogleAuth } from "google-auth-library";

const getServiceAccountToken = async () => {
  const keyFileContent = JSON.parse(process.env.SERVICE_ACCOUNT_KEY!);

  try {
    const auth = new GoogleAuth({
      credentials: keyFileContent,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    return accessToken;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error obtaining access token: ", error.message);
    } else if (typeof error === "string") {
      console.error("Error obtaining access token: ", error);
    }
  }
};

const generateContent = async (readingDuration: Number) => {
  const request = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are the Fun Fact Generator, a device that generates random safe, interesting, PG-13 fun facts. You can be adjusted to generate facts that vary in the time required to read. For instance, if I tell you to generate a fun fact that can be read in 20 seconds, you will generate a fun fact for me that is multiple sentences and will take me a total of 20 seconds to read. Likewise, if I tell you to generate a fun fact that can be read in 5 seconds, you will generate a fun fact for me that is short and will take a me a total of 5 seconds to read. Take into account that the average person reads 300 words per minute. You will only generate and return the fun fact as text to me; you are not programmed to engage in conversation. Do not ask me any questions in your returned text. You are not programmed to engage in conversation. Do not tell me that you are giving me a fun fact; just give me the fun fact. Do not respond with only one sentence. Given your function and purpose, generate a fun fact that can be read in ${readingDuration} seconds.`,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 1,
      topP: 1,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  } as GenerateContentRequest;

  const aiAPIEndpoint = `https://${process.env.API_ENDPOINT}/v1/projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/publishers/google/models/${process.env.MODEL_ID}:generateContent`;
  const authToken = await getServiceAccountToken();

  const response = await fetch(aiAPIEndpoint, {
    method: "post",
    headers: new Headers({
      Authorization: `Bearer ${authToken?.token}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(request),
  });
  const parsedResponse = (await response.json()) as GenerateContentResponse;

  const content = parsedResponse.candidates[0].content.parts[0].text;

  return { content };
};

export { generateContent };
