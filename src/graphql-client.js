import Taro from '@tarojs/taro'
import ApolloClient from 'apollo-boost'
import { authLogin } from './utils/auth'

const client = new ApolloClient({
  uri: 'https://miniprogram.yacnlee.top/graphql',
  fetch: async(url, options) => {
    const { headers } = options || {
      headers: {},
    }
    try {
      const token = Taro.getStorageSync('token')
      const { data, statusCode } = await Taro.request({
        url,
        method: options.method,
        data: options.body,
        header: { ...headers, authorization: token },
      })
      const { errors } = data
      const clientStasusCode = errors ? errors[0].message.statusCode : statusCode
      if( clientStasusCode === 401){
        Taro.removeStorage({
          key: 'token',
          success: function() {
            authLogin({})
          },
        })
      }
      return {
        ok: () => {
          return statusCode >= 200 && statusCode < 300
        },
        text: () => {
          return Promise.resolve(JSON.stringify(data))
        },
      }
    } catch (error) {
      throw error
    }
  },
})

client.defaultOptions = {
  query: {
    fetchPolicy: 'no-cache',
  },
}

export default client
