import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { typeDefs } from "./schema/schema.js";
import { resolvers } from "./resolvers/query.js";
import { ApolloServerContext } from "./types/apolloServerContext.js";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<ApolloServerContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
