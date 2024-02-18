import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { readFileSync } from "fs";
import express from "express";
import http from "http";
import cors from "cors";
import { resolvers } from "./resolvers/query.js";
import { ApolloServerContext } from "./types/apolloServerContext.js";

const app = express();
const httpServer = http.createServer(app);

const typeDefs = readFileSync("./src/schema/schema.graphql", {
  encoding: "utf-8",
});

const server = new ApolloServer<ApolloServerContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(cors());
app.use(express.json());

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

app.use("/", async (req, res, next) => {
  res.send("This is a GraphQL server. Make a request at /graphql");
});

const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
