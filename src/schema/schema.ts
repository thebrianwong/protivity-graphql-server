const typeDefs = `#graphql
  type AiText {
    content: String
  }

  type Query {
    aiText(duration: Int!): AiText!
  }
`;

export { typeDefs };
