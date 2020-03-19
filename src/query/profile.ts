import { gql } from 'apollo-boost'

export const profileInfoQuery = gql`
  query {
    profileInfo {
      salesCount
      purchaseCount
    }
  }
`

export const certificationApplyQuery = gql`
  mutation ($email: String!){
    certifyEmailApply(email: $email)
  }
`
