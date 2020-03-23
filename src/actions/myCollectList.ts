import { Dispatch } from 'redux'

import client from '../graphql-client'
import {
  FETCH_MY_COLLECT_LIST,
  FETCH_MY_COLLECT_LIST_SUCCESS,
  FETCH_MY_COLLECT_LIST_FINALLY,
  RESET_MY_COLLECT_LIST,
  UPDATE_MY_COLLECT_LIST_DATA, FETCH_MY_COLLECT_LIST_ERROR, DELETE_MY_COLLECT_LIST_DATA,
} from '../constants/actionTypes'
import { searchMyCollectQuery } from '../query/collect'

const fetchStart = () => {
  return {
    type: FETCH_MY_COLLECT_LIST,
  }
}

const fetchSuccess = (payload) => {
  return {
    type: FETCH_MY_COLLECT_LIST_SUCCESS,
    payload,
  }
}

const fetchError = (payload) => {
  return {
    type: FETCH_MY_COLLECT_LIST_ERROR,
    payload,
  }
}

const fetchFinally = () => {
  return {
    type: FETCH_MY_COLLECT_LIST_FINALLY,
  }
}

export const resetMyCollectListState = () => {
  return {
    type: RESET_MY_COLLECT_LIST,
  }
}

export const updateListData = (payload) => {
  return {
    type: UPDATE_MY_COLLECT_LIST_DATA,
    payload,
  }
}

export const deleteCollectData = (payload) => {
  return {
    type: DELETE_MY_COLLECT_LIST_DATA,
    payload,
  }
}

export function fetchMyCollectList(searchInput) {
  return async(dispatch: Dispatch) => {
    try {
      dispatch(fetchStart())
      const { data } = await client.query({ query: searchMyCollectQuery, variables: { searchInput }})
      dispatch(fetchSuccess(data))
    } catch (error) {
      dispatch(fetchError({ error }))
    } finally {
      dispatch(fetchFinally())
    }
  }
}

