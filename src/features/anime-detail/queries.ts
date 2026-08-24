import { graphql } from "@/lib/anilist/generated";

export const animeDetailQuery = graphql(`
  query AnimeDetail($id: Int!) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
      }
      description(asHtml: false)
      coverImage {
        large
      }
      bannerImage
      format
      status
      episodes
      duration
      genres
      averageScore
      startDate {
        year
        month
        day
      }
      studios(isMain: true) {
        nodes {
          name
        }
      }
    }
  }
`);
