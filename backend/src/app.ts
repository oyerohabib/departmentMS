import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { expressMiddleware } from "@as-integrations/express4";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import courseRoutes from "./routes/course.routes";
import materialRoutes from "./routes/material.routes";
import { createApolloServer } from "./graphql/server";
import { buildContext } from "./graphql/context";

dotenv.config();

async function start() {
  const app = express();

  app.get("/", (_req, res) => {
    res.json({
      message: "Welcome to Campus connect Backend API",
    });
  });

  // Middleware — allow localhost and 127.0.0.1 (Playwright uses 127.0.0.1)
  const allowedOrigins: (string | RegExp)[] = [
    /^http:\/\/localhost:\d+$/,
    /^http:\/\/127\.0\.0\.1:\d+$/,
    process.env.FRONTEND_URL || "https://department-ms.vercel.app",
  ].filter(Boolean);

  app.use(
    cors({
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => {
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some((allowedOrigin) =>
          allowedOrigin instanceof RegExp
            ? allowedOrigin.test(origin)
            : allowedOrigin === origin
        );

        if (isAllowed) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  // REST routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/materials", materialRoutes);

  // GraphQL
  const apolloServer = createApolloServer();
  await apolloServer.start();
  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req }) => buildContext({ req }),
    })
  );

  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
    console.log(`GraphQL endpoint at http://localhost:${port}/graphql`);
  });

  return app;
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default start;
