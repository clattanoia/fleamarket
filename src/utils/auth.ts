import Taro from '@tarojs/taro'
import client from '../graphql-client'
import {loginQuery} from '../query/login'
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

interface Inprops {
  callback?: () => void
}

export async function authLogin(props: Inprops) {

  try {
    const { code } = await Taro.login()
    const userData = await Taro.getUserInfo()
    delete userData['errMsg']
    const {userInfo} = userData
    const nickname = userInfo.nickName
    delete userInfo['nickName']
    const newUserInfo = {...userInfo,nickname}
    userData.userInfo = newUserInfo
    const {platform} = await Taro.getSystemInfo()
    GlobalData.authInfo = {code,userData,platform}
    const loginInput = GlobalData.authInfo

    const { data } = await client.mutate({mutation:loginQuery, variables: {loginInput}})
    Taro.setStorage({
      key:'token',
      data: data.login.token
    })
    props.callback && props.callback()
    return true
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
