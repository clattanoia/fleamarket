import { gql } from 'apollo-boost'

export const goodsDetailQuery = gql`
query($id: String!) {
  detailInfo: goodsById(id: $id) {
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

export const purchaseDetailQuery = gql`
  query($id: String!) {
    detailInfo: purchaseById(id: $id) {
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
export const pullOffShelvesGoodsMutation = gql`
  mutation($id: String!) {
    pullOffShelvesGoods(id: $id)
  }
`
export const putOnShelvesGoodsMutation = gql`
  mutation($id: String!) {
    putOnShelvesGoods(id: $id)
  }
`
