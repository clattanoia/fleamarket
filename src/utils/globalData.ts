
interface InGlobalData {
  authInfo?: Auth.InAuthInfo
}

let authInfo: Auth.InAuthInfo

export const GlobalData: InGlobalData = {
  set authInfo(newAuthInfo) {
    authInfo = {...authInfo,...newAuthInfo}
  },
  get authInfo(): Auth.InAuthInfo {
    return authInfo
  },
}

export const a = []



