import {
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from "@google-cloud/vertexai";
import "dotenv/config";

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION!,
});
const model = "gemini-pro";

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model,
  generation_config: {
    max_output_tokens: 2048,
    temperature: 1,
    top_p: 1,
  },
  safety_settings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

const generateContent = async (readingDuration: Number) => {
  const req = {
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
  };

  const streamingResp = await generativeModel.generateContentStream(req);

  let content = "";

  for await (const item of streamingResp.stream) {
    const genTextSnippet = item.candidates[0].content.parts[0].text;
    content += genTextSnippet;
  }

  return { content };
};

export { generateContent };
