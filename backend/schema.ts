import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Game {
    id: ID!
    title: String!
    date: String!
    location: String!
    maxPlayers: Int!
    interestedPlayers: [Player!]!
  }

  type Player {
    id: ID!
    phoneNumber: String!
  }

  type Query {
    games: [Game!]!
  }

  type Mutation {
    createGame(title: String!, date: String!, location: String!, maxPlayers: Int!): Game!
    joinGame(gameId: ID!, playerId: ID!): Game!
    verifyPhoneNumber(phoneNumber: String!): String!
    validateOTP(phoneNumber: String!, otp: String!): String!
  }

  type Subscription {
    gameUpdated(gameId: ID!): Game!
  }
`;

export default typeDefs;