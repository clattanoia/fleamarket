import { gql } from 'apollo-boost'


export const searchGoodsQuery = gql`
query($searchInput: SearchInput) {
  searchResult: searchGoods (searchInput:$searchInput ){
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
      }
    }
    pageIndex
    pageSize
    totalElements
    totalPages
  }
}
`


export const searchPurchaseQuery = gql`
query($searchInput: SearchInput) {
  searchResult: searchPurchase (searchInput:$searchInput ){
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
      }
    }
    pageIndex
    pageSize
    totalElements
    totalPages
  }
}
`
