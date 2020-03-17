import { gql } from 'apollo-boost'

const SearchResultFragment =  gql`
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


export const searchGoodsQuery = gql`
query($searchInput: SearchInput) {
  searchResult: searchGoods (searchInput:$searchInput ){
    ...SearchResultFragment
  }
}
${SearchResultFragment}
`


export const searchPurchaseQuery = gql`
query($searchInput: SearchInput) {
  searchResult: searchPurchase (searchInput:$searchInput ){
    ...SearchResultFragment
  }
}
${SearchResultFragment}
`

export const searchMyGoodsQuery = gql`
  query($searchInput: SearchInput) {
    searchResult: searchMyGoods (searchInput:$searchInput ){
      ...SearchResultFragment
    }
  }
  ${SearchResultFragment}
`


export const searchMyPurchaseQuery = gql`
  query($searchInput: SearchInput) {
    searchResult: searchMyPurchase (searchInput:$searchInput ){
      ...SearchResultFragment
    }
  }
  ${SearchResultFragment}
`
