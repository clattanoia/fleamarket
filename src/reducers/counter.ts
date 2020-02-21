import { ADD, MINUS, FETCH } from '../constants'

const INITIAL_STATE = {
  num: 0,
  data: null
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        num: state.num + 1
      }
    case MINUS:
      return {
        ...state,
        num: state.num - 1
      }
    case FETCH:
      return {
        ...state,
        data: action.data
      }
    default:
      return state
  }
}
