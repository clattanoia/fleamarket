import { gql } from 'apollo-boost'

export const addContactMutation = gql`
mutation ($userId: String!, $addContactInput: AddContactInput!){
  addContact(userId: $userId, addContactInput: $addContactInput)
}
`
