import Taro from '@tarojs/taro'
// import client from '../graphql-client'
// import {countQuery} from '../query/login'

export default async function authLogin() {
  try {
    Taro.checkSession({
      success: function () {
        // console.log(res)
      },
      fail: async function () {
        // const { code } = await Taro.login()
        // console.log(code)
        // const {userInfo} = await Taro.getUserInfo()
        // console.log(userInfo)
        // try {
        //   const { data } = await client.query({countQuery, variables: {}})
        //   // const { data } = await client.query({loginQuery, variables: {code,...userInfo}})
        //   console.log('--------checkSession------success---------------------------')
        //   console.log(data)
        // } catch (error) {
        //   console.log('--------checkSession------error---------------------------')
        //   throw error
        // }
      }
    })

  } catch (err) {
    // console.log('登录失败')
    throw err
  }
}
