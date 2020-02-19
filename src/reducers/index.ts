import { combineReducers } from 'redux'
import counter from './counter'
import recommend from './recommend'

export default combineReducers({
  counter,
  recommend
})
