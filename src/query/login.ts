import { gql } from 'apollo-boost'

export const loginQuery = gql`
mutation AuthLogin($loginInput: AuthLoginParams) {
  authLogin(authInfo: $authInfo) {
    token
  }
}
`

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
  phoneData: {
    encryptedData: string
    iv: string
    errMsg: string
  }
  platform: string
}

export const loginQueryBff = gql`
mutation {
  login(loginInput: AuthLoginParams) {
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
