import { combineReducers } from 'redux'
import recommend from './recommend'
import category from './category'
import userinfo from './userInfo'

export default combineReducers({
  recommend,
  category,
  userinfo,
})
