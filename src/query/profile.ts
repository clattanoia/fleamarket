import { gql } from 'apollo-boost'

export const profileInfoQuery = gql`
  query($userId: String!) {
    profileInfo(userId: $userId) {
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
