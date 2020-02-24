import { combineReducers } from 'redux'
import recommend from './recommend'
import category from './category'
import userInfo from './userInfo'

export default combineReducers({
  recommend,
  category,
  userInfo,
})
