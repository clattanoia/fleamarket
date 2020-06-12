import client from '../graphql-client'
import { FETCH_DISTRICTS } from '../constants/actionTypes'
import { districtsQuery } from '../query/districts'

export const fetch = (data) => {
  return {
    type: FETCH_DISTRICTS,
    data,
  }
}

export function fetchDistricts() {
  return async dispatch => {
    try {
      const { data } = await client.query({ query: districtsQuery, variables: {}})
      dispatch(fetch(data))
    } catch (error) {
      throw error
    }
  }
}
