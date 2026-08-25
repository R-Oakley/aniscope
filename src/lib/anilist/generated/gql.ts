/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query AnimeDetail($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      id\n      title {\n        romaji\n        english\n      }\n      description(asHtml: false)\n      coverImage {\n        large\n      }\n      bannerImage\n      format\n      status\n      episodes\n      duration\n      genres\n      averageScore\n      startDate {\n        year\n        month\n        day\n      }\n      studios(isMain: true) {\n        nodes {\n          name\n        }\n      }\n    }\n  }\n": typeof types.AnimeDetailDocument,
    "\n  query AnimeCharacters($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      characters(sort: ROLE, perPage: 12) {\n        edges {\n          role\n          node {\n            id\n            name {\n              full\n            }\n            image {\n              medium\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.AnimeCharactersDocument,
    "\n  query AnimeRelations($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      relations {\n        edges {\n          relationType\n          node {\n            id\n            title {\n              romaji\n              english\n            }\n            coverImage {\n              large\n            }\n            format\n            episodes\n            averageScore\n          }\n        }\n      }\n    }\n  }\n": typeof types.AnimeRelationsDocument,
    "\n  query AnimeRecommendations($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      recommendations(sort: RATING_DESC, perPage: 10) {\n        nodes {\n          mediaRecommendation {\n            id\n            title {\n              romaji\n              english\n            }\n            coverImage {\n              large\n            }\n            format\n            episodes\n            averageScore\n          }\n        }\n      }\n    }\n  }\n": typeof types.AnimeRecommendationsDocument,
    "\n  query SearchAnime(\n    $query: String\n    $page: Int\n    $perPage: Int\n    $genre: String\n    $format: MediaFormat\n    $status: MediaStatus\n    $season: MediaSeason\n  ) {\n    Page(page: $page, perPage: $perPage) {\n      pageInfo {\n        hasNextPage\n      }\n      media(\n        search: $query\n        type: ANIME\n        isAdult: false\n        genre: $genre\n        format: $format\n        status: $status\n        season: $season\n        sort: POPULARITY_DESC\n      ) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n": typeof types.SearchAnimeDocument,
    "\n  query TrendingAnime($perPage: Int) {\n    Page(perPage: $perPage) {\n      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n": typeof types.TrendingAnimeDocument,
};
const documents: Documents = {
    "\n  query AnimeDetail($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      id\n      title {\n        romaji\n        english\n      }\n      description(asHtml: false)\n      coverImage {\n        large\n      }\n      bannerImage\n      format\n      status\n      episodes\n      duration\n      genres\n      averageScore\n      startDate {\n        year\n        month\n        day\n      }\n      studios(isMain: true) {\n        nodes {\n          name\n        }\n      }\n    }\n  }\n": types.AnimeDetailDocument,
    "\n  query AnimeCharacters($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      characters(sort: ROLE, perPage: 12) {\n        edges {\n          role\n          node {\n            id\n            name {\n              full\n            }\n            image {\n              medium\n            }\n          }\n        }\n      }\n    }\n  }\n": types.AnimeCharactersDocument,
    "\n  query AnimeRelations($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      relations {\n        edges {\n          relationType\n          node {\n            id\n            title {\n              romaji\n              english\n            }\n            coverImage {\n              large\n            }\n            format\n            episodes\n            averageScore\n          }\n        }\n      }\n    }\n  }\n": types.AnimeRelationsDocument,
    "\n  query AnimeRecommendations($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      recommendations(sort: RATING_DESC, perPage: 10) {\n        nodes {\n          mediaRecommendation {\n            id\n            title {\n              romaji\n              english\n            }\n            coverImage {\n              large\n            }\n            format\n            episodes\n            averageScore\n          }\n        }\n      }\n    }\n  }\n": types.AnimeRecommendationsDocument,
    "\n  query SearchAnime(\n    $query: String\n    $page: Int\n    $perPage: Int\n    $genre: String\n    $format: MediaFormat\n    $status: MediaStatus\n    $season: MediaSeason\n  ) {\n    Page(page: $page, perPage: $perPage) {\n      pageInfo {\n        hasNextPage\n      }\n      media(\n        search: $query\n        type: ANIME\n        isAdult: false\n        genre: $genre\n        format: $format\n        status: $status\n        season: $season\n        sort: POPULARITY_DESC\n      ) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n": types.SearchAnimeDocument,
    "\n  query TrendingAnime($perPage: Int) {\n    Page(perPage: $perPage) {\n      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n": types.TrendingAnimeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AnimeDetail($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      id\n      title {\n        romaji\n        english\n      }\n      description(asHtml: false)\n      coverImage {\n        large\n      }\n      bannerImage\n      format\n      status\n      episodes\n      duration\n      genres\n      averageScore\n      startDate {\n        year\n        month\n        day\n      }\n      studios(isMain: true) {\n        nodes {\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AnimeDetail($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      id\n      title {\n        romaji\n        english\n      }\n      description(asHtml: false)\n      coverImage {\n        large\n      }\n      bannerImage\n      format\n      status\n      episodes\n      duration\n      genres\n      averageScore\n      startDate {\n        year\n        month\n        day\n      }\n      studios(isMain: true) {\n        nodes {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AnimeCharacters($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      characters(sort: ROLE, perPage: 12) {\n        edges {\n          role\n          node {\n            id\n            name {\n              full\n            }\n            image {\n              medium\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AnimeCharacters($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      characters(sort: ROLE, perPage: 12) {\n        edges {\n          role\n          node {\n            id\n            name {\n              full\n            }\n            image {\n              medium\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AnimeRelations($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      relations {\n        edges {\n          relationType\n          node {\n            id\n            title {\n              romaji\n              english\n            }\n            coverImage {\n              large\n            }\n            format\n            episodes\n            averageScore\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AnimeRelations($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      relations {\n        edges {\n          relationType\n          node {\n            id\n            title {\n              romaji\n              english\n            }\n            coverImage {\n              large\n            }\n            format\n            episodes\n            averageScore\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AnimeRecommendations($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      recommendations(sort: RATING_DESC, perPage: 10) {\n        nodes {\n          mediaRecommendation {\n            id\n            title {\n              romaji\n              english\n            }\n            coverImage {\n              large\n            }\n            format\n            episodes\n            averageScore\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AnimeRecommendations($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      recommendations(sort: RATING_DESC, perPage: 10) {\n        nodes {\n          mediaRecommendation {\n            id\n            title {\n              romaji\n              english\n            }\n            coverImage {\n              large\n            }\n            format\n            episodes\n            averageScore\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchAnime(\n    $query: String\n    $page: Int\n    $perPage: Int\n    $genre: String\n    $format: MediaFormat\n    $status: MediaStatus\n    $season: MediaSeason\n  ) {\n    Page(page: $page, perPage: $perPage) {\n      pageInfo {\n        hasNextPage\n      }\n      media(\n        search: $query\n        type: ANIME\n        isAdult: false\n        genre: $genre\n        format: $format\n        status: $status\n        season: $season\n        sort: POPULARITY_DESC\n      ) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n"): (typeof documents)["\n  query SearchAnime(\n    $query: String\n    $page: Int\n    $perPage: Int\n    $genre: String\n    $format: MediaFormat\n    $status: MediaStatus\n    $season: MediaSeason\n  ) {\n    Page(page: $page, perPage: $perPage) {\n      pageInfo {\n        hasNextPage\n      }\n      media(\n        search: $query\n        type: ANIME\n        isAdult: false\n        genre: $genre\n        format: $format\n        status: $status\n        season: $season\n        sort: POPULARITY_DESC\n      ) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TrendingAnime($perPage: Int) {\n    Page(perPage: $perPage) {\n      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n"): (typeof documents)["\n  query TrendingAnime($perPage: Int) {\n    Page(perPage: $perPage) {\n      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;