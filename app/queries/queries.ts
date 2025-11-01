export const getAllBlogsQuery = `
  query {
  blogCollection(limit: 5) {
    items {
      _id
      title
      slug
      description
      publishedDate
      featuredImage {
        contentType
        description
        fileName
        height
        size
        title
        url
        width
      }
      content {
        json
        links {
          assets {
            block {
              sys { id }
              url
              title
              description
              width
              height
              contentType
            }
          }
        }
      }
    }
  }
}
`;
