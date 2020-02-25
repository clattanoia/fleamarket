import { Dispatch } from 'redux'
import client from '../graphql-client'
import { FETCH_USERINFO } from '../constants'
import { userInfoQuery } from '../query/userInfo'

export const fetch = (data) => {
  return {
    type: FETCH_USERINFO,
    data
  }
}

export function fetchUserInfo() {
  return async (dispatch: Dispatch) => {
    const query = userInfoQuery

    try {
      const { data } = await client.query({query, variables: {}})
      dispatch(fetch(data))
    } catch (error) {
      // console.log('error-->', error)
      throw error
    }
  }
}
