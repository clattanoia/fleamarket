import { Dispatch } from 'redux'
import client from '../graphql-client'
import { FETCH_USERINFO, ADD_CONTACT } from '../constants'
import { userInfoQuery } from '../query/userInfo'
import { addContactMutation } from '../query/contact'

export const fetch = (data) => {
  return {
    type: FETCH_USERINFO,
    data,
  }
}

export const updateContact = (data) => {
  return {
    type: ADD_CONTACT,
    data,
  }
}

export function fetchUserInfo() {
  return async(dispatch: Dispatch) => {
    const query = userInfoQuery

    try {
      const { data } = await client.query({ query, variables: {}})
      dispatch(fetch(data))
    } catch (error) {
      // console.log('error-->', error)
      throw error
    }
  }
}

export function addContact(addContactInput, userId) {
  return async(dispatch: Dispatch) => {

    try {
      const { data } = await client.mutate({
        mutation: addContactMutation,
        variables: { userId, addContactInput },
      })

      // const data = { addContact: '123124534' }

      const newContact = { ...addContactInput, id: data.addContact }

      dispatch(updateContact(newContact))
    } catch (error) {
      throw error
    }
  }
}
