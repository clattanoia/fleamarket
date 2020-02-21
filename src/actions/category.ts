import { gql } from 'apollo-boost'
import client from '../graphql-client'

export const fetch = (data) => {
  return {
    type: 'FETCH',
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
