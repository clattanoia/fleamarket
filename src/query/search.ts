import { gql } from 'apollo-boost'


export const searchGoodsQuery = gql`
query($searchInput: SearchInput) {
  searchGoods (searchInput:$searchInput ){
    content {
      id
      title
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
  searchPurchase (searchInput:$searchInput ){
    content {
      id
      title
    }
    pageIndex
    pageSize
    totalElements
    totalPages
  }
}
`
