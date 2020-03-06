import { gql } from 'apollo-boost'

export const addContactMutation = gql`
mutation ($userId: String!, $addContactInput: AddContactInput!){
  addContact(userId: $userId, addContactInput: $addContactInput)
}
`

export const deleteContactMutation = gql`
mutation ($userId: String!, $contactId: String!) {
  deleteContact(userId: $userId, contactId: $contactId)
}
`
