import { combineReducers } from 'redux'
import recommend from './recommend'
import category from './category'
import userInfo from './userInfo'
import global from './global'

export default combineReducers({
  recommend,
  category,
  userInfo,
  global
})
