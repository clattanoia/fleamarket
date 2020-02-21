const INITIAL_STATE = {
  category: [],
}

export default function category (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'FETCH':
      return {
        ...state,
        category: action.data.category
      }
    default:
      return state
  }
}
