import { gql } from 'apollo-boost'

export const collectedQuery = gql`
query collectedQuery($collectInput:CollectInput) {
  collected (collectInput:$collectInput ){
    result
  }
}`

export const collectMutation = gql`
mutation collectMutation($collectInput:CollectInput){
  collect(collectInput:$collectInput)
}
`

export const unCollectMutation = gql`
mutation unCollectMutation($collectInput:CollectInput){
  unCollect(collectInput:$collectInput)
}
`
