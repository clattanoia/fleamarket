import { gql } from 'apollo-boost'
import client from '../graphql-client'

export const fetch = (data) => {
  return {
    type: 'FETCH',
    data
  }
}

export function fetchCategories() {
  return async dispatch => {
    const query = gql`
      {
        category {
          id,
          name,
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
