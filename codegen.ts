import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://graphql.anilist.co",
  documents: ["src/**/*.{ts,tsx}"],
  ignoreNoDocuments: true,
  generates: {
    "src/lib/anilist/generated/": {
      preset: "client",
    },
  },
};

export default config;
