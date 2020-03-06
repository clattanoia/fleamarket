import { SET_AUTH_INFO, SET_PRODUCT_SEARCH } from '../constants'
import { ProductType } from '../constants/enums'

export const INITIAL_STATE = {
  isOpenedAuthInfo: false,
  productSearch: {
    categoryId: '',
    currentProductType: ProductType.GOODS,
    title: '',
  },
}

export default function global(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_AUTH_INFO:
      return {
        ...state,
        isOpenedAuthInfo: action.payload,
      }
    case SET_PRODUCT_SEARCH: {
      const { productSearch } = state
      return {
        ...state,
        productSearch: {
          ...productSearch, ...action.payload,
        },
      }
    }
    default:
      return state
  }
}

