import { SET_AUTH_INFO } from '../constants'

export const setAuthInfo = (payload) => {
  return {
    type: SET_AUTH_INFO,
    payload
  }
}
