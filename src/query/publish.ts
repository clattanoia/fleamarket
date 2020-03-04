import { gql } from 'apollo-boost'

export const publishGoodsMutation = gql`
mutation ($publishInput: PublishInput!){
  publishGoods(publishInput: $publishInput)
}
`

export const publishPurchaseMutation = gql`
  mutation ($publishInput: PublishInput!){
    publishPurchase(publishInput: $publishInput)
  }
`

export const getQiniuTokenQuery = gql`
{
  qiniuToken {
    token
  }
}`
