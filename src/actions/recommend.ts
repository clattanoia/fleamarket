import { gql } from 'apollo-boost'
import client from '../graphql-client'
import FETCH_RECOMMEND from '../constants'

export const fetch = (data) => {
  return {
    type: FETCH_RECOMMEND,
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
