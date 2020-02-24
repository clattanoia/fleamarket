import { combineReducers } from 'redux'
import recommend from './recommend'
import category from './category'

export default combineReducers({
  recommend,
  category,
})
