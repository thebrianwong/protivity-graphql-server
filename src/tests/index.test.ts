import { ApolloServer } from "@apollo/server";
// import { ApolloServerContext } from "../types/apolloServerContext";
import { readFileSync } from "fs";
// import { resolvers } from "../resolvers/query";

test("The server responds with generated text", async () => {
  const typeDefs = readFileSync("./src/schema/schema.graphql", {
    encoding: "utf-8",
  });

  // const server = new ApolloServer<ApolloServerContext>({
  //   typeDefs,
  //   resolvers,
  // });

  // const response = await server.executeOperation({
  //   query:
  //     "query Query($duration: Int!) { aiText(duration: $duration) {content}}",
  //   variables: { duration: 20 },
  // });

  // expect(response).toHaveProperty([
  //   "body",
  //   "singleResult",
  //   "data",
  //   "aiText",
  //   "content",
  // ]);
});
