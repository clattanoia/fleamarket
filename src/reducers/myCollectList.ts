import {
  FETCH_MY_COLLECT_LIST,
  FETCH_MY_COLLECT_LIST_SUCCESS,
  FETCH_MY_COLLECT_LIST_FINALLY,
  RESET_MY_COLLECT_LIST,
  UPDATE_MY_COLLECT_LIST_DATA, FETCH_MY_COLLECT_LIST_ERROR,
} from '../constants/actionTypes'
import { Product } from '../interfaces/product'

export interface InMyCollectListState {
  pageIndex: number
  pageSize: number
  totalPages: number
  listData: Product[]
  showPreload: boolean
  showLoadMore: boolean
  isToastOpened: boolean,
  toastText: string,
}

const INITIAL_STATE: InMyCollectListState = {
  pageIndex: 0,
  pageSize: 10,
  totalPages: 0,
  listData: [],

  showPreload: false,
  showLoadMore: false,
  isToastOpened: false,
  toastText: '',
}

export default function myCollectList(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_MY_COLLECT_LIST: {
      const { listData } = state
      const newState: InMyCollectListState = { ...state }

      if(listData.length) {
        newState.showLoadMore = true
      } else {
        newState.showPreload = true
      }

      return {
        ...newState,
      }
    }

    case FETCH_MY_COLLECT_LIST_SUCCESS: {
      const { payload } = action
      const newState: InMyCollectListState = { ...state }

      newState.pageIndex = state.pageIndex + 1
      newState.totalPages = payload.searchResult.totalPages
      newState.listData = state.listData.concat(payload.searchResult.content)
      return {
        ...newState,
      }
    }

    case FETCH_MY_COLLECT_LIST_ERROR: {
      const { payload } = action
      let toastText = '加载失败'
      console.log('payload.error.message', payload.error.message)
      if(payload.error.message.indexOf('400') > -1) {
        toastText = '登陆失效，请返回重新操作'
      }
      return {
        ...state,
        isToastOpened: true,
        toastText,
      }
    }

    case FETCH_MY_COLLECT_LIST_FINALLY: {
      return {
        ...state,
        showLoadMore: false,
        showPreload: false,
      }
    }

    case RESET_MY_COLLECT_LIST: {
      return {
        ...INITIAL_STATE,
      }
    }

    case UPDATE_MY_COLLECT_LIST_DATA: {
      const { listData } = state
      const { payload } = action

      const index = listData.findIndex(item => item.id === payload.id)
      if(index < 0) {
        return state
      }

      listData[index] = { ...{}, ...listData[index], ...payload.modification }
      return {
        ...state,
        listData,
      }
    }

    default:
      return state
  }
}
