import Taro from '@tarojs/taro'
import client from '../graphql-client'
import {loginQuery} from '../query/login'
import {GlobalData} from './globalData'

interface Inprops {
  callback?: () => void
}

export async function authLogin(props: Inprops) {
  try {
    const { code } = await Taro.login()
    const userData = await Taro.getUserInfo()
    delete userData['errMsg']
    delete userData['userInfo']
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
