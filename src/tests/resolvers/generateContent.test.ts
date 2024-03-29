import { generateContent } from "../../resolvers/generateContent";

test("The generate content resolver returns content", async () => {
  const results = await generateContent(20);

  expect(results).toHaveProperty("content");
});
