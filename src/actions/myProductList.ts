import { Dispatch } from 'redux'

import client from '../graphql-client'
import {
  FETCH_MY_PRODUCT_LIST,
  FETCH_MY_PRODUCT_LIST_SUCCESS,
  FETCH_MY_PRODUCT_LIST_FINALLY,
  RESET_MY_PRODUCT_LIST,
  UPDATE_MY_PRODUCT_LIST_DATA,
} from '../constants/actionTypes'
import { ProductType } from '../constants/enums'
import { searchMyGoodsQuery, searchMyPurchaseQuery } from '../query/search'

const fetchStart = () => {
  return {
    type: FETCH_MY_PRODUCT_LIST,
  }
}

const fetchSuccess = (payload) => {
  return {
    type: FETCH_MY_PRODUCT_LIST_SUCCESS,
    payload,
  }
}

const fetchFinally = () => {
  return {
    type: FETCH_MY_PRODUCT_LIST_FINALLY,
  }
}

export const resetMyProductListState = () => {
  return {
    type: RESET_MY_PRODUCT_LIST,
  }
}

export const updateListData = (payload) => {
  return {
    type: UPDATE_MY_PRODUCT_LIST_DATA,
    payload,
  }
}

const delay = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1200)
  })
}

export function fetchMyProductList(searchInput, productType) {
  return async(dispatch: Dispatch) => {
    const query = productType === ProductType.GOODS ? searchMyGoodsQuery : searchMyPurchaseQuery
    try {
      dispatch(fetchStart())
      await delay()
      const { data } = await client.query({ query, variables: { searchInput }})
      dispatch(fetchSuccess(data))
    } catch (error) {
      console.log('fetchMyProductList-->', error)
      throw error
    } finally {
      dispatch(fetchFinally())
    }
  }
}

