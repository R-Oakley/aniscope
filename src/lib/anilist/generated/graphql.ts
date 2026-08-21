/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** The format the media was released in */
export type MediaFormat =
  /** Professionally published manga with more than one chapter */
  | 'MANGA'
  /** Anime movies with a theatrical release */
  | 'MOVIE'
  /** Short anime released as a music video */
  | 'MUSIC'
  /** Written books released as a series of light novels */
  | 'NOVEL'
  /** (Original Net Animation) Anime that have been originally released online or are only available through streaming services. */
  | 'ONA'
  /** Manga with just one chapter */
  | 'ONE_SHOT'
  /** (Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast */
  | 'OVA'
  /** Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc */
  | 'SPECIAL'
  /** Anime broadcast on television */
  | 'TV'
  /** Anime which are under 15 minutes in length and broadcast on television */
  | 'TV_SHORT';

export type TrendingAnimeQueryVariables = Exact<{
  perPage?: number | null | undefined;
}>;


export type TrendingAnimeQuery = { Page: { media: Array<{ id: number, format: MediaFormat | null, episodes: number | null, averageScore: number | null, title: { romaji: string | null, english: string | null } | null, coverImage: { large: string | null } | null } | null> | null } | null };


export const TrendingAnimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrendingAnime"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"perPage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"perPage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"perPage"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"EnumValue","value":"TRENDING_DESC"}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"ANIME"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"romaji"}},{"kind":"Field","name":{"kind":"Name","value":"english"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"large"}}]}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"episodes"}},{"kind":"Field","name":{"kind":"Name","value":"averageScore"}}]}}]}}]}}]} as unknown as DocumentNode<TrendingAnimeQuery, TrendingAnimeQueryVariables>;