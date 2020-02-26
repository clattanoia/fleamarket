import { FETCH_DETAIL } from '../constants'

const INITIAL_STATE = {
  detail: null,
}

export default function category (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DETAIL:
      return {
        ...state,
      }
    default:
      return state
  }
}
