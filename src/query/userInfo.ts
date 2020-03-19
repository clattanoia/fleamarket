import { gql } from 'apollo-boost'

export const userInfoQuery = gql`
  query {
    user {
      id
      nickname
      brief
      country
      province
      city
      avatarUrl
      gender
      lastVisitTime
      platform
      contacts {
        id
        type
        content
        label
      }
      certification
    }
  }
`

