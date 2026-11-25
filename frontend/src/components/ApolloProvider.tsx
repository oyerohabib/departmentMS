"use client";

import { useState } from "react";
import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "@/lib/apollo-client";

export default function ApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(() => createApolloClient());
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
