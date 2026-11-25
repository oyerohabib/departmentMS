"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

function getGraphqlUri() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000/api";
  // NEXT_PUBLIC_API_URL ends with /api → GraphQL lives at origin/graphql
  return apiUrl.replace(/\/api\/?$/, "/graphql");
}

export function createApolloClient() {
  const httpLink = new HttpLink({
    uri: getGraphqlUri(),
  });

  const authLink = new ApolloLink((operation, forward) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }));
    return forward(operation);
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network" },
      query: { fetchPolicy: "network-only" },
    },
  });
}
