import Taro from '@tarojs/taro'
import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
  uri: 'https://miniprogram.yacnlee.top/graphql',
  fetch: async (url, options) => {
    try {
      const { data, statusCode } = await Taro.request({
        url,
        method: options.method,
        data: options.body,
        header: options.headers
      })
      return {
        ok: () => {
          return statusCode >= 200 && statusCode < 300
        },
        text: () => {
          return Promise.resolve(JSON.stringify(data))
        }
      }
    } catch (error) {
      throw error
    }
  }
})

export default client
