import { gql } from 'apollo-boost'

export const profileInfoQuery = gql`
  query profileInfoQuery($productStatus: Status){
    profileInfo(productStatus:$productStatus ) {
      salesCount
      purchaseCount
      salesCollectCount
      purchaseCollectCount
    }
  }
`

export const certificationApplyQuery = gql`
  mutation ($email: String!){
    certifyEmailApply(email: $email)
  }
`
