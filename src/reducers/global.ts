import { SET_AUTH_INFO, SET_PRODUCT_SEARCH, RESET_PRODUCT_SEARCH, SET_LOCATION_SELECT, RESET_LOCATION_SELECT } from '../constants/actionTypes'
import { ProductType, SearchOrderBy, SearchSortDirection, ProductStatus } from '../constants/enums'

const INITIAL_STATE = {
  isOpenedAuthInfo: false,
  productSearch: {
    categoryId: '',
    categoryName: '',
    currentProductType: ProductType.GOODS,
    title: '',
    orderBy: SearchOrderBy.RC,
    sortDirection: SearchSortDirection.DESC,
    status: ProductStatus.ALL,
  },
  locationSelect: {
    province: null,
    city: null,
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
    case RESET_PRODUCT_SEARCH:
      return {
        ...state,
        productSearch: INITIAL_STATE.productSearch,
      }
    case SET_LOCATION_SELECT:
      return {
        ...state,
        locationSelect: action.payload,
      }
    case RESET_LOCATION_SELECT:
      return {
        ...state,
        locationSelect: undefined,
      }
    default:
      return state
  }
}

