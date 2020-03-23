import { gql } from 'apollo-boost'

export const SearchResultFragment =  gql`
  fragment SearchResultFragment on SearchResult {
    content {
      id
      title
      price
      coverUrl
      category
      categoryName
      description
      coverUrl
      status
      createTime
      updateTime
      pictures
      contacts
      readCount
      owner {
        id
        nickname
        avatarUrl
        certification
      }
    }
    pageIndex
    pageSize
    totalElements
    totalPages
  }
`
