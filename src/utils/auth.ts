import Taro from '@tarojs/taro'
// import client from '../graphql-client'
// import {loginQuery} from '../query/login'

export default async function authLogin() {
  // const {userInfo} = await Taro.getUserInfo()
  // console.log(userInfo)
  // const { code } = await Taro.login()
  // console.log(code)

  // const { data } = await client.query({loginQuery, variables: {code,...userInfo}})
  // console.log(data)

  try {
    Taro.checkSession({
      success: function () {
        // console.log(res)
      },
      fail: async function () {
        // const {userInfo} = await Taro.getUserInfo()
        // console.log(userInfo)
        // const { code } = await Taro.login()
        // console.log(code)
        // // TODO 获取openID+sessionkey

        // try {
        //   const { data } = await client.query({loginQuery, variables: {}})
        //   console.log(data)
        // } catch (error) {
        //   throw error
        // }

      }
    })

  } catch (err) {
    // console.log('登录失败')
    throw err
  }
}
