import { gql } from 'apollo-boost'

export const loginQuery = gql`
mutation ($loginInput: LoginInput){
  login(loginInput: $loginInput) {
    token
  }
}
`

export const countQuery = gql`
{
  cat(id: 1) {
    id
    name
  }
}
`
