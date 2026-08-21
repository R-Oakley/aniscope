import { GraphQLClient } from "graphql-request";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export const anilistClient = new GraphQLClient(ANILIST_ENDPOINT);
