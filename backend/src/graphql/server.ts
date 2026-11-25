import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema";
import { courseResolvers } from "./resolvers/course.resolvers";
import { GraphQLContext } from "./context";

export function createApolloServer() {
  return new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers: courseResolvers,
  });
}
