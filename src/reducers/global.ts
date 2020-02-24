import { SET_AUTH_INFO } from '../constants'

const INITIAL_STATE = {
  isOpenedAuthInfo: false
}

export default function global (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_AUTH_INFO:
      return {
        ...state,
        isOpenedAuthInfo: action.payload
      }
    default:
      return state
  }
}

