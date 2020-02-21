const INITIAL_STATE = {
  goods: [],
}

export default function recommend (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'FETCH':
      return {
        ...state,
        goods: action.data.goods
      }
    default:
      return state
  }
}
