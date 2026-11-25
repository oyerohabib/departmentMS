import { Request } from "express";
import jwt from "jsonwebtoken";
import { createLoaders, GraphQLLoaders } from "./dataloaders";

export type AuthUser = {
  userId: string;
  role: string;
  email?: string;
};

export type GraphQLContext = {
  user: AuthUser | null;
  loaders: GraphQLLoaders;
};

export async function buildContext({
  req,
}: {
  req: Request;
}): Promise<GraphQLContext> {
  let user: AuthUser | null = null;
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : undefined;

  if (token) {
    try {
      user = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as AuthUser;
    } catch {
      user = null;
    }
  }

  return {
    user,
    loaders: createLoaders(),
  };
}
