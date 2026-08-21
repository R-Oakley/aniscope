import { graphql } from "@/lib/anilist/generated";

export const trendingAnimeQuery = graphql(`
  query TrendingAnime($perPage: Int) {
    Page(perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME) {
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
