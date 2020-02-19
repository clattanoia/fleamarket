const INITIAL_STATE = {
  recommendList: [],
}

export default function recommend (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'FETCH':
      return {
        ...state,
        data: action.data
      }
    default:
      return state
  }
}
