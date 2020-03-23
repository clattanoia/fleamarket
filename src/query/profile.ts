import { gql } from 'apollo-boost'

export const profileInfoQuery = gql`
  query {
    profileInfo {
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
