import client from '../graphql-client'
import { FETCH_RECOMMEND } from '../constants'
import { recommendListQuery } from '../query/recommend'

export const fetch = (data) => {
  return {
    type: FETCH_RECOMMEND,
    data
  }
}

export function fetchRecommendGoods() {
  return async dispatch => {
    const query = recommendListQuery

    try {
      const { data } = await client.query({query, variables: {}})
      dispatch(fetch(data))
    } catch (error) {
      throw error
    }
  }
}
