import { combineReducers } from 'redux'
import category from './category'
import userInfo from './userInfo'
import global from './global'
import myProductList from './myProductList'
import myCollectList from './myCollectList'

export default combineReducers({
  category,
  userInfo,
  global,
  myProductList,
  myCollectList,
})
