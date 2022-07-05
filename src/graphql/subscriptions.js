
export const onCreateVideoObject = /* GraphQL */ `
  subscription OnCreateVideoObject {
    onCreateVideoObject {
      id
      createdAt
      updatedAt
    }
  }
`;
export const onCreateVodAsset = /* GraphQL */ `
  subscription OnCreateVodAsset ($filter: String) { 
    onCreateVodAsset (filter: $filter) {
        id
        title
        description
        category
        vodAssetVideoId
    }
  }
`;
export const onUpdateVideoObject = /* GraphQL */ `
  subscription OnUpdateVideoObject {
    onUpdateVideoObject {
      id
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteVideoObject = /* GraphQL */ `
  subscription OnDeleteVideoObject {
    onDeleteVideoObject {
      id
      createdAt
      updatedAt
    }
  }
`;
