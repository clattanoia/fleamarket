import { gql } from 'apollo-boost'
import { SearchResultFragment } from './fragment'


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
