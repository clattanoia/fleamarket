import { gql } from 'apollo-boost'
import client from '../graphql-client'
import { FETCH_USERINFO } from '../constants'

export const fetch = (data) => {
  return {
    type: FETCH_USERINFO,
    data
  }
}

export function fetchUserInfo() {
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
    } catch (error) {
      throw error
    }
  }
}
