import { combineReducers } from 'redux'
import category from './category'
import userInfo from './userInfo'
import global from './global'

export default combineReducers({
  category,
  userInfo,
  global
})
