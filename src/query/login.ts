import { gql } from 'apollo-boost'

export const loginQuery = gql`
mutation ($loginInput: LoginInput!){
  login(loginInput: $loginInput) {
    token
  }
}
`

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
}}
`
