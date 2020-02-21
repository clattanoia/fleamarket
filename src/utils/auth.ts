import Taro from '@tarojs/taro'
import client from '../graphql-client'
import {loginQueryBff} from '../query/login'
import {GlobalData} from './globalData'

// export async function authLogin() {
//   try {
//     Taro.checkSession({
//       success: function (res) {
//         console.log('----checkSession-------success-------',res)
//       },
//       fail: async function () {
//         const { code } = await Taro.login()
//         const userData = await Taro.getUserInfo()
//         const {platform} = await Taro.getSystemInfo()
//         GlobalData.authInfo = {code,userData,platform}
//         const authInfo = GlobalData.authInfo
//         console.log(authInfo)

//         try {
//           const { data } = await client.query({loginQuery, variables: {authInfo}})
//           console.log('--------login------success---------------------------')
//           console.log(data)
//         } catch (error) {
//           console.log('--------logiin------error---------------------------')
//           throw error
//         }
//       }
//     })

//   } catch (err) {
//     throw err
//   }
// }

export async function authLogin() {

  const { code } = await Taro.login()
  const userData = await Taro.getUserInfo()
  const {platform} = await Taro.getSystemInfo()
  GlobalData.authInfo = {code,userData,platform}
  const loginInput = GlobalData.authInfo
  // console.log(loginInput)
  // const loginInput = {
  //   code: "js_code",
  //   userData: {
  //     encryptedData: "encryptedData",
  //     iv: "iv",
  //     rawData: "rawData",
  //     signature: "signature",
  //     userInfo: {
  //       nickname: "Allen",
  //       country: "china",
  //       province: "sichuan",
  //       city: "chengdu",
  //       avatarUrl: "https://avatarUrl.png",
  //       gender: 0,
  //       language: "zh_cn"
  //     }
  //   },
  //   phoneData: {
  //    encryptedData: "encryptedData",
  //   iv: "iv"
  //   },
  //   platform: "wechat"
  // }

  try {
    const { data } = await client.mutate({mutation:loginQueryBff, variables: {loginInput}})
    // console.log('--------login------success---------------------------')
    // console.log(data)
    return true || data
  } catch (error) {
    throw error
  }
}

export async function isAuthUserInfo() {
  let isAuthUserInfo = false
  await Taro.getSetting({
    success(res) {
      isAuthUserInfo = !!res.authSetting['scope.userInfo']
    }
  })
  return isAuthUserInfo
}
