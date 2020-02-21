declare namespace Auth {

  interface InAuthInfo {
    code?: string,
    userData?: {
      encryptedData: string
      iv: string
      rawData: string
      signature: string
      userInfo: {
        avatarUrl: string
        city: string
        country: string
        gender: number
        language: string
        nickname: string
        province: string
      }
      errMsg: string
    }
    phoneData?: {
      encryptedData: string
      iv: string
      errMsg: string
    }
    platform?: string
  }


}
