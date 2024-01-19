import { generateContent } from "./generateContent.js";

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    aiText: (parent, args, contextValue, info) =>
      generateContent(args.duration),
  },
};

export { resolvers };
