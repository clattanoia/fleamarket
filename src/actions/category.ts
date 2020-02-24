import client from '../graphql-client'
import { FETCH_CATEGORIES } from '../constants'
import { categoryQuery } from '../query/category'

export const fetch = (data) => {
  return {
    type: FETCH_CATEGORIES,
    data
  }
}

export function fetchCategories(callback) {
  return async dispatch => {
    const query = categoryQuery

    try {
      const { data } = await client.query({query, variables: {}})
      dispatch(fetch(data))
      callback(data)
    } catch (error) {
      throw error
    }
  }
}
