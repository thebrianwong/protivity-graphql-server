import { GraphQLResolveInfo } from "graphql";
import { generateContent } from "./generateContent.js";
import {
  AiText,
  QueryAiTextArgs,
  RequireFields,
  ResolverTypeWrapper,
  Resolvers,
} from "../generated/graphql.js";

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers: Resolvers = {
  Query: {
    aiText: (
      parent: ResolverTypeWrapper<AiText>,
      args: RequireFields<QueryAiTextArgs, "duration">,
      contextValue: any,
      info: GraphQLResolveInfo
    ) => generateContent(args.duration),
  },
};

export { resolvers };
