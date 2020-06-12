import { FETCH_DISTRICTS } from '../constants/actionTypes'

const INITIAL_STATE = {
  districts: [],
}

export default function districts(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DISTRICTS:
      return {
        ...state,
        districts: action.data.districts,
      }
    default:
      return state
  }
}
