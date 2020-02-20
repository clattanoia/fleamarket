declare namespace Auth {

  interface InAuthInfo {
    code?: string,
    userInfo?: {
      avatarUrl: string
      city: string
      country: string
      gender: number
      language: string
      nickName: string
      province: string
    }

  }
}
