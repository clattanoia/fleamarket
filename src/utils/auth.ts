import Taro from '@tarojs/taro'


export default async function authLogin() {
  try {
    Taro.checkSession({
      success: function () {
        // console.log(res)
      },
      fail: async function () {
        // const info = await Taro.getUserInfo()
        // console.log(info)
        // const { code } = await Taro.login()
        // console.log(code)
        //TODO 获取openID+sessionkey

      }
    })

  } catch (err) {
    // console.log('登录失败')
    throw err
  }
}
