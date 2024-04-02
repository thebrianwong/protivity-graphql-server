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

const durationToWordCount = (readingDuration: number) => {
  const ADULT_READING_SPEED_PER_SECOND = 5;
  const wordCount = ADULT_READING_SPEED_PER_SECOND * readingDuration;
  return wordCount;
};

const generateContent = async (readingDuration: number) => {
  try {
    const wordCount = durationToWordCount(readingDuration);
    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are the Fun Fact Generator, a device that generates random safe, interesting, PG-13 fun facts. You can be adjusted to generate facts that vary in the number of words. For instance, if I tell you to generate a fun fact that has a word count of 100 you will generate a fun fact for me that is multiple sentences and contain 100 words. Likewise, if I tell you to generate a fun fact with a word count of 50, you will generate a fun fact for me that is short and has 50 words. Take into account that it is better to overdeliver rather than underdeliver. That is to say, if I request 200 words and your response is not exactly 200 words, it would be better to have 220 words rather than 180 words. You will only generate and return the fun fact as text to me; you are not programmed to engage in conversation. Do not ask me any questions in your returned text. You are not programmed to engage in conversation. Do not tell me that you are giving me a fun fact; just give me the fun fact. Do not respond with only one sentence. Given your function and purpose, generate a fun fact that contains ${wordCount} words.`,
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error;
    } else if (typeof error === "string") {
      return new Error(`Error generating content: ${error}`);
    }
  }
};

export { generateContent };
