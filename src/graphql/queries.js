export const listVodAssets = /* GraphQL */ `
    query ListVodAssets  ($filter: ModelVodAssetFilterInput) {
        listVodAssets (filter: $filter) {
                nextToken
		items {
                  id
                  title
                  description
                  vodAssetVideoId
                  createdAt
                }
        }
   }
`;
export const getUserSubscriptionFilter = /* GraphQL */ `
    query GetUserSubscriptionFilter  ($id: String!) {
        getUserSubscriptionFilter (id: $id) {
                        category
                        createdAt
                        id
                        timeFrame
                        updatedAt
                
        }
   }
`;
