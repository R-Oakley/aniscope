import { graphql } from "@/lib/anilist/generated";

export const searchAnimeQuery = graphql(`
  query SearchAnime(
    $query: String
    $page: Int
    $perPage: Int
    $genre: String
    $format: MediaFormat
    $status: MediaStatus
    $season: MediaSeason
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
      }
      media(
        search: $query
        type: ANIME
        isAdult: false
        genre: $genre
        format: $format
        status: $status
        season: $season
        sort: POPULARITY_DESC
      ) {
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
