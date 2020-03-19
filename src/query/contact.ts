import { gql } from 'apollo-boost'

export const addContactMutation = gql`
mutation ($addContactInput: AddContactInput!){
  addContact(addContactInput: $addContactInput)
}
`

export const deleteContactMutation = gql`
mutation ($contactId: String!) {
  deleteContact(contactId: $contactId)
}
`
