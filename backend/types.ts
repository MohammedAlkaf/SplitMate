import { Db } from "mongodb";
import { PubSub } from "graphql-subscriptions";

export interface Context {
  db: Db;
  pubsub: PubSub;
}

export interface Game {
  id: string;
  title: string;
  date: string;
  location: string;
  maxPlayers: number;
  interestedPlayers: Player[];
}

export interface Player {
  id: string;
  phoneNumber: string;
}