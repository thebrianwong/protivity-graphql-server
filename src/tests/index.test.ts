import { handler } from "../index";
import * as generateContent from "../generateContent";

test("The Lambda has a 200 status code", async () => {
  const res = await handler({ duration: 20 });
  expect(res).toHaveProperty("statusCode", 200);
});

test("The Lambda returns with content", async () => {
  const res = await handler({ duration: 20 });
  expect(res).toHaveProperty("body");
});

test("The Lambda has a 500 status code and error if an error occurs", async () => {
  jest.spyOn(generateContent, "generateContent").mockImplementationOnce(() => {
    throw Error("Something went wrong!");
  });
  const res = await handler({ duration: 20 });
  expect(res).toHaveProperty("statusCode", 500);
  expect(res).toHaveProperty("error", Error("Something went wrong!"));
});
