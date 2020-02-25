import { gql } from 'apollo-boost'

export const userInfoQuery = gql`
  query($id: String) {
    user(id: $id) {
      id
      unionId
      nickname
      brief
      country
      province
      city
      avatarUrl
      gender
      lastVisitTime
      platform
      contacts {id}
    }
  }
`

// export const userInfoQuery = gql`
//   {
//     categories {
//       id,
//       name,
//       icon
//     }
//   }
// `
