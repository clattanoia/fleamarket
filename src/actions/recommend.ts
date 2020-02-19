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
        cat(id: 1) {
          id
          name
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
