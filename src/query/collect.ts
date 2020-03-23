import { gql } from 'apollo-boost'
import { SearchResultFragment } from './fragment'

export const collectedQuery = gql`
query collectedQuery($collectInput:CollectInputQuery) {
  collected (collectInput:$collectInput ){
    result
  }
}`

export const collectMutation = gql`
mutation collectMutation($collectInput:CollectInputQuery){
  collect(collectInput:$collectInput)
}
`

export const unCollectMutation = gql`
mutation unCollectMutation($collectInput:CollectInputQuery){
  unCollect(collectInput:$collectInput)
}
`
export const searchMyCollectQuery = gql`
query searchMyCollectQuery($searchInput:SearchCollectInput) {
  searchResult: searchMyCollect (searchInput:$searchInput ){
    ...SearchResultFragment
  }
}
${SearchResultFragment}
`
