import { combineReducers } from 'redux'
import counter from './counter'
import recommend from './recommend'
import category from './category'

export default combineReducers({
  counter,
  recommend,
  category,
})
