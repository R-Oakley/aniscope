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
    "\n  query SearchAnime($query: String!, $perPage: Int) {\n    Page(perPage: $perPage) {\n      media(search: $query, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n": typeof types.SearchAnimeDocument,
    "\n  query TrendingAnime($perPage: Int) {\n    Page(perPage: $perPage) {\n      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n": typeof types.TrendingAnimeDocument,
};
const documents: Documents = {
    "\n  query AnimeDetail($id: Int!) {\n    Media(id: $id, type: ANIME, isAdult: false) {\n      id\n      title {\n        romaji\n        english\n      }\n      description(asHtml: false)\n      coverImage {\n        large\n      }\n      bannerImage\n      format\n      status\n      episodes\n      duration\n      genres\n      averageScore\n      startDate {\n        year\n        month\n        day\n      }\n      studios(isMain: true) {\n        nodes {\n          name\n        }\n      }\n    }\n  }\n": types.AnimeDetailDocument,
    "\n  query SearchAnime($query: String!, $perPage: Int) {\n    Page(perPage: $perPage) {\n      media(search: $query, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n": types.SearchAnimeDocument,
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
export function graphql(source: "\n  query SearchAnime($query: String!, $perPage: Int) {\n    Page(perPage: $perPage) {\n      media(search: $query, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n"): (typeof documents)["\n  query SearchAnime($query: String!, $perPage: Int) {\n    Page(perPage: $perPage) {\n      media(search: $query, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TrendingAnime($perPage: Int) {\n    Page(perPage: $perPage) {\n      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n"): (typeof documents)["\n  query TrendingAnime($perPage: Int) {\n    Page(perPage: $perPage) {\n      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {\n        id\n        title {\n          romaji\n          english\n        }\n        coverImage {\n          large\n        }\n        format\n        episodes\n        averageScore\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;