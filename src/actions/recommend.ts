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
          id,
          title,
          price,
          coverUrl,
          categoryName,
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
