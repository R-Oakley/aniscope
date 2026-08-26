import { graphql } from "@/lib/anilist/generated";

export const viewerQuery = graphql(`
  query Viewer {
    Viewer {
      id
      name
      avatar {
        medium
      }
    }
  }
`);
