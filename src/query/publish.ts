import { gql } from 'apollo-boost'

export const publishMutation = gql`
mutation ($publishInput: PublishInput!){
  publish(publishInput: $publishInput)
}
`

export const getQiniuTokenQuery = gql`
{
  qiniuToken {
    token
  }
}`