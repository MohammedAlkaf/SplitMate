import { IResolvers } from "@graphql-tools/utils";
import { PubSub } from "graphql-subscriptions";
import { Context, Game } from "./types";
import { ObjectId } from "mongodb";

const pubsub = new PubSub();

const resolvers: IResolvers<any, Context> = {
  Query: {
    games: async (_, __, { db }) => {
      return await db.collection("games").find().toArray();
    },
  },

  Mutation: {
    createGame: async (
      _,
      { title, date, location, maxPlayers }: { title: string; date: string; location: string; maxPlayers: number },
      { db }
    ): Promise<Game> => {
      const game: Omit<Game, "id"> = {
        title,
        date,
        location,
        maxPlayers,
        interestedPlayers: [],
      };
      const result = await db.collection("games").insertOne(game);
      return { id: result.insertedId.toString(), ...game };
    },

    joinGame: async (
      _,
      { gameId, playerId }: { gameId: string; playerId: string },
      { db }
    ): Promise<Game> => {
      const result = await db.collection("games").findOneAndUpdate(
        { _id: new ObjectId(gameId) },
        { $addToSet: { interestedPlayers: playerId } },
        { returnDocument: "after" }
      );

      
      if (!result) {
        throw new Error("Game not found");
      }

      pubsub.publish(`GAME_UPDATED_${gameId}`, { gameUpdated: result.value });
      return { id: result.value._id.toString(), ...result.value };
    },

    verifyPhoneNumber: async (
      _,
      { phoneNumber }: { phoneNumber: string }
    ): Promise<string> => {
      // Use Twilio or any SMS provider to send OTP
      console.log(`Sending OTP to ${phoneNumber}`);
      return "OTP sent successfully!";
    },

    validateOTP: async (
      _,
      { phoneNumber, otp }: { phoneNumber: string; otp: string }
    ): Promise<string> => {
      // Validate the OTP
      console.log(`Validating OTP for ${phoneNumber}`);
      return "Phone number verified!";
    },
  },

  Subscription: {
    gameUpdated: {
      subscribe: (_, { gameId }: { gameId: string }) => pubsub.asyncIterator(`GAME_UPDATED_${gameId}`),
    },
  },
};

export default resolvers;