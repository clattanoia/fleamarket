declare namespace Auth {

  interface InAuthInfo {
    code?: string,
    userData?: {
      encryptedData: string
      iv: string
      rawData: string
      signature: string
    }
    phoneData?: {
      encryptedData: string
      iv: string
    }
    platform?: string
  }


}
