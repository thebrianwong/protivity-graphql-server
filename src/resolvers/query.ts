import { GraphQLResolveInfo } from "graphql";
import { AiTextArgs } from "../types/aiTextArgs.type.js";
import { generateContent } from "./generateContent.js";

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    aiText: (
      parent: never,
      args: AiTextArgs,
      contextValue: never,
      info: GraphQLResolveInfo
    ) => generateContent(args.duration),
  },
};

export { resolvers };
