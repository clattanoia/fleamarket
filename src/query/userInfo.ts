import { gql } from 'apollo-boost'

export const userInfoQuery = gql`
  query($id: String) {
    user(id: $id) {
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
      }
    }
  }
`

