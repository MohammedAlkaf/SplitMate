import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import { PubSub } from "graphql-subscriptions";
import { Context } from "./types";

const pubsub = new PubSub();
const PORT = 4000;

(async () => {
  const app = express();

  // MongoDB connection
  await mongoose.connect(process.env.MONGO_URI || "");

  const db = mongoose.connection.db;

  if (!db) throw new Error("Database connection failed!");

  // Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (): Context => ({
      db,
      pubsub,
    }),
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
})();