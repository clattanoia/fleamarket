import { gql } from 'apollo-boost'
import client from '../graphql-client'
import FETCH_CATEGORIES from '../constants'

export const fetch = (data) => {
  return {
    type: FETCH_CATEGORIES,
    data
  }
}

export function fetchCategories(callback) {
  return async dispatch => {
    const query = gql`
      {
        categories {
          id,
          name,
          icon
        }
      }
    `

    try {
      const { data } = await client.query({query, variables: {}})
      dispatch(fetch(data))
      callback(data)
    } catch (error) {
      throw error
    }
  }
}
