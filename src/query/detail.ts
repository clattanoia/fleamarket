import { gql } from 'apollo-boost'

export const detailQuery = gql`
query($id: String!) {
  goods: goodsById(id: $id) {
    id
    title
    price
    coverUrl
    category
    categoryName
    description
    coverUrl
    status
    createTime
    updateTime
    pictures
    contacts
    owner {
      id
      nickname
      avatarUrl
      }
    }
  }
`

export const contactsQuery = gql`
  query($userId: String!, $ids: [String]!) {
    contacts(userId: $userId, ids: $ids) {
      id
      content
      type
    }
  }
`