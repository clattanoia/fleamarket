import { combineReducers } from 'redux'
import category from './category'
import userInfo from './userInfo'
import global from './global'
import myProductList from './myProductList'
import district from './district'

export default combineReducers({
  category,
  userInfo,
  global,
  myProductList,
  district,
})
