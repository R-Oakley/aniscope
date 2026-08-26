import { graphql } from "@/lib/anilist/generated";

export const animeDetailQuery = graphql(`
  query AnimeDetail($id: Int!) {
    Media(id: $id, type: ANIME, isAdult: false) {
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

export const animeCharactersQuery = graphql(`
  query AnimeCharacters($id: Int!) {
    Media(id: $id, type: ANIME, isAdult: false) {
      characters(sort: ROLE, perPage: 12) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              medium
            }
          }
        }
      }
    }
  }
`);

export const animeRelationsQuery = graphql(`
  query AnimeRelations($id: Int!) {
    Media(id: $id, type: ANIME, isAdult: false) {
      relations {
        edges {
          relationType
          node {
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
    }
  }
`);

export const mediaFavouriteStatusQuery = graphql(`
  query MediaFavouriteStatus($id: Int!) {
    Media(id: $id, type: ANIME, isAdult: false) {
      isFavourite
    }
  }
`);

export const toggleFavouriteAnimeMutation = graphql(`
  mutation ToggleFavouriteAnime($animeId: Int) {
    ToggleFavourite(animeId: $animeId) {
      anime {
        pageInfo {
          total
        }
      }
    }
  }
`);

export const animeRecommendationsQuery = graphql(`
  query AnimeRecommendations($id: Int!) {
    Media(id: $id, type: ANIME, isAdult: false) {
      recommendations(sort: RATING_DESC, perPage: 10) {
        nodes {
          mediaRecommendation {
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
    }
  }
`);
