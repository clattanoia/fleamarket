import { gql } from 'apollo-boost'

export const profileInfoQuery = gql`
{
  profileInfo {
    salesCount
    purchaseCount
  }
}
`
