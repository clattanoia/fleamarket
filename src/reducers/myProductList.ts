import {
  FETCH_MY_PRODUCT_LIST,
  FETCH_MY_PRODUCT_LIST_SUCCESS,
  FETCH_MY_PRODUCT_LIST_FINALLY,
  RESET_MY_PRODUCT_LIST,
} from '../constants/actionTypes'
import { Product } from '../interfaces/product'

export interface InMyProductListState {
  pageIndex: number
  pageSize: number
  totalPages: number
  listData: Product[]
  showPreload: boolean
  showLoadMore: boolean
}

const INITIAL_STATE: InMyProductListState = {
  pageIndex: 0,
  pageSize: 10,
  totalPages: 0,
  listData: [],

  showPreload: false,
  showLoadMore: false,
}

export default function myProductList(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_MY_PRODUCT_LIST: {
      const { listData } = state
      const newState: InMyProductListState = { ...state }

      if(listData.length) {
        newState.showLoadMore = true
      } else {
        newState.showPreload = true
      }

      return {
        ...newState,
      }
    }

    case FETCH_MY_PRODUCT_LIST_SUCCESS: {
      const { payload } = action
      const newState: InMyProductListState = { ...state }

      newState.pageIndex = state.pageIndex + 1
      newState.totalPages = payload.searchResult.totalPages
      newState.listData = state.listData.concat(payload.searchResult.content)
      return {
        ...newState,
      }
    }

    case FETCH_MY_PRODUCT_LIST_FINALLY: {
      return {
        ...state,
        showLoadMore: false,
        showPreload: false,
      }
    }

    case RESET_MY_PRODUCT_LIST: {
      console.log('RESET_MY_PRODUCT_LIST', INITIAL_STATE)
      return {
        ...INITIAL_STATE,
      }
    }

    default:
      return state
  }
}
