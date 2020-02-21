import { gql } from 'apollo-boost'

type AuthLoginParams = {
  code: string
  userData: {
    encryptedData: string
    iv: string
    rawData: string
    signature: string
    errMsg: string
    userInfo: {
      nickname: string
      country: string
      province: string
      city: string
      avatarUrl: string
      gender: number
      language: string
    }
  }
  platform: string
}

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
