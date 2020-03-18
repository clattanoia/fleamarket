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

export const auditImageQuery = gql`
query auditImageQuery($imgUrl: String!) {
  auditImage (imgUrl:$imgUrl ){
    token
  }
}`

export const editGoodsMutation = gql`
mutation ($productId: String!, $publishInput: PublishInput!){
  editGoods(productId: $productId, publishInput: $publishInput)
}
`

export const editPurchaseMutation = gql`
mutation ($productId: String!, $publishInput: PublishInput!){
  editPurchase(productId: $productId, publishInput: $publishInput)
}
`
