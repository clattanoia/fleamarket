import Taro from '@tarojs/taro'
import ApolloClient from 'apollo-boost'
import { authLogin } from './utils/auth'

const client = new ApolloClient({
  uri: 'https://dev.2hj.com.cn/graphql',
  // uri: 'http://localhost:3000/graphql',
  // uri: 'https://2hj.com.cn/graphql',
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
      const clientStatusCode = errors
        ? (errors[0].message.statusCode || errors[0].message.status)
        : statusCode

      if(clientStatusCode === 401) {
        Taro.removeStorage({
          key: 'token',
          success: function() {
            authLogin({})
          },
        })
      }

      if(clientStatusCode !== 200) {
        throw new Error(
          JSON.stringify(errors[0].message ? errors[0].message : errors[0])
        )
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
  onError: error => {
    console.log(error)
  },
})

client.defaultOptions = {
  query: {
    fetchPolicy: 'no-cache',
  },
}

export default client
