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

export const updateUserInfoQuery = gql`
  mutation ($userInfoInput: UserInfoInput!){
    userInfo: updateUserInfo(userInfoInput: $userInfoInput) {
      nickname
      avatarUrl
      brief
    }
  }
`

