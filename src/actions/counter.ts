import { gql } from 'apollo-boost'
import client from '../graphql-client'

import {
  ADD,
  MINUS,
  FETCH
} from '../constants/counter'

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

// export function asyncGet() {
//   return dispatch => {
//     const GET_DOGS = gql`
//     {
//       dogs {
//         id
//         breed
//       }
//     }
//   `
//     // const { loading, error } = useQuery(GET_DOGS)
//     //
//     // if (loading) return 'Loading...'
//     // if (error) return `Error! ${error.message}`
//
//     client.query({ query: GET_DOGS })
//
//     dispatch(add())
//   }
// }
//
// export function asyncGraphqlAdd () {
//   return dispatch => {
//     const ADD_TODO = gql`
//       mutation AddTodo($type: String!) {
//         addTodo(type: $type) {
//           id
//           type
//         }
//       }
//     `
//     // useMutation(ADD_TODO)
//     client.mutate({ mutation: ADD_TODO })
//
//     dispatch(add())
//   }
// }
