import { gql } from 'apollo-boost'
import client from '../graphql-client'

export const fetch = (data) => {
  return {
    type: 'FETCH',
    data
  }
}

export function fetchRecommendGoods() {
  return async dispatch => {
    const query = gql`
      {
        goods {
          title,
          price,
          coverUrl,
          categoryName,
          createTime,
          updateTime,
          owner {
            nickname,
            avatarUrl
          }
        }
      }
    `

    try {
      const { data } = await client.query({query, variables: {}})
      dispatch(fetch(data))
    } catch (error) {
      throw error
    }
  }
}
