import { gql } from 'apollo-boost'

export const publishGoodsMutation = gql`
mutation ($publishInput: PublishInput!){
  publishedProduct: publishGoods(publishInput: $publishInput)
}
`

export const publishPurchaseMutation = gql`
  mutation ($publishInput: PublishInput!){
    publishedProduct: publishPurchase(publishInput: $publishInput)
  }
`

export const getQiniuTokenQuery = gql`
{
  qiniuToken {
    token
  }
}`

export const auditImageTokenQuery = gql`
query auditImageTokenQuery($imgUrl: String!) {
  auditImageToken (imgUrl:$imgUrl ){
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
