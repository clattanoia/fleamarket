import { gql } from 'apollo-boost'
import client from '../graphql-client'

import {
  ADD,
  MINUS,
  FETCH
} from '../constants'

export const add = () => {
  return {
    type: ADD
  }
}
export const minus = () => {
  return {
    type: MINUS
  }
}
export const fetch = (data) => {
  return {
    type: FETCH,
    data
  }
}

// 异步的action
export function asyncAdd () {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}

export function asyncGrapqlFetch() {
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
