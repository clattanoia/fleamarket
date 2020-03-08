import { FETCH_CATEGORIES } from '../constants/actionTypes'

const INITIAL_STATE = {
  categories: [],
}

export default function category(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return {
        ...state,
        categories: action.data.categories,
      }
    default:
      return state
  }
}
