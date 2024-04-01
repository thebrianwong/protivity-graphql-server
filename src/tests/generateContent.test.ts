import { generateContent } from "../generateContent";

test("The generate content resolver returns content", async () => {
  const results = await generateContent(20);
  expect(results).toHaveProperty("content");
});

test("An error is caught if there is an issue generating content", async () => {
  jest.spyOn(global, "fetch").mockImplementationOnce(() => {
    throw Error("Something went wrong!");
  });
  const results = await generateContent(20);
  expect(results).toStrictEqual(new Error("Something went wrong!"));
});
