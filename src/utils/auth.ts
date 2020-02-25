import Taro from '@tarojs/taro'
import client from '../graphql-client'
import {loginQuery} from '../query/login'
import {GlobalData} from './globalData'
import {fetch} from '../actions/recommend'
import { setAuthInfo } from '../actions/global'
import {store} from '../store/store'

interface Inprops {
  callback?: () => void
}

const taroEnv = {
  'WEAPP':'WECHAT'
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

export async function authLogin(props: Inprops) {
  try {
    const token = Taro.getStorageSync('token')
    if (token){
      props.callback && props.callback()
      return
    }

    const { code } = await Taro.login()

    const isAuth = await isAuthUserInfo()
    if(!isAuth){
      store.dispatch(setAuthInfo(true))
      return
    }

    const userData = await Taro.getUserInfo()
    delete userData['errMsg']
    delete userData['userInfo']
    const platform = taroEnv[Taro.getEnv()] || 'WECHAT'
    GlobalData.authInfo = {code,userData,platform}
    const loginInput = GlobalData.authInfo

    const { data } = await client.mutate({mutation:loginQuery, variables: {loginInput}})
    Taro.setStorage({
      key:'token',
      data: data.login.token
    })
    store.dispatch(fetch({data:{goods:[]}}))
    props.callback && props.callback()
  } catch (error) {
    throw error
  }
}
