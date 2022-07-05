export const createVideoObject = /* GraphQL */ `
  mutation CreateVideoObject($id: ID
) {
    createVideoObject(input: {id: $id}) {
       id
       createdAt
    }
  }
`;
export const createVodAsset = /* GraphQL */ `
    mutation CreateVodAsset($id: ID!, $title: String!, $description: String!, $category: String!, $vodAssetVideoId: ID) {    
        createVodAsset(input: {id: $id, title: $title, description: $description, category: $category, vodAssetVideoId: $vodAssetVideoId}) {
                id
                createdAt
                title
                description
                category
                vodAssetVideoId

        }
   }
`;
export const createUserSubscriptionFilter = /* GraphQL */ `
    mutation createUserSubscriptionFilter($id: String!, $category: String!, $timeFrame: String!) {    
      createUserSubscriptionFilter(input: {id: $id, category: $category, timeFrame: $timeFrame}) {
                id
                createdAt
                category
                timeFrame
        }
   }
`;
