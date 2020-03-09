import { Dispatch } from 'redux'
import client from '../graphql-client'
import { FETCH_USERINFO, ADD_CONTACT, DELETE_CONTACT } from '../constants'
import { userInfoQuery } from '../query/userInfo'
import { addContactMutation, deleteContactMutation } from '../query/contact'
import { desensitizationContact } from '../utils/helper'

export const fetch = (data) => {
  return {
    type: FETCH_USERINFO,
    data,
  }
}

export const addContacts = (data) => {
  const maskContent = desensitizationContact(data.type, data.content)
  const newContact = { ...data, content: maskContent }

  return {
    type: ADD_CONTACT,
    data: newContact,
  }
}

export const deleteContacts = (data) => {
  return {
    type: DELETE_CONTACT,
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

      const newContact = { ...addContactInput, id: data.addContact }

      dispatch(addContacts(newContact))
    } catch (error) {
      throw error
    }
  }
}

export function deleteContact(contactId, userId) {
  return async(dispatch: Dispatch) => {

    try {
      await client.mutate({
        mutation: deleteContactMutation,
        variables: { userId, contactId },
      })

      dispatch(deleteContacts(contactId))

    } catch (error) {
      throw error
    }
  }
}
