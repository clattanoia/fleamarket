import { SET_AUTH_INFO, SET_PRODUCT_SEARCH, RESET_PRODUCT_SEARCH, SET_LOCATION_SELECT } from '../constants/actionTypes'

export const setAuthInfo = (payload) => {
  return {
    type: SET_AUTH_INFO,
    payload,
  }
}

export const setProductSearch = (payload) => {
  return {
    type: SET_PRODUCT_SEARCH,
    payload,
  }
}

export const resetProductSearch = () => {
  return {
    type: RESET_PRODUCT_SEARCH,
  }
}

export const setLocationSelect = (payload) => {
  return {
    type: SET_LOCATION_SELECT,
    payload,
  }
}
