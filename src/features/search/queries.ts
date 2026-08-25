import { graphql } from "@/lib/anilist/generated";

export const searchAnimeQuery = graphql(`
  query SearchAnime($query: String!, $perPage: Int) {
    Page(perPage: $perPage) {
      media(search: $query, type: ANIME, isAdult: false) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        format
        episodes
        averageScore
      }
    }
  }
`);
