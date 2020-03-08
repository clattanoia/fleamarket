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
    readCount
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
      readCount
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
      label
    }
  }
`
export const pullOffShelvesGoodsMutation = gql`
  mutation($id: String!, $userId: String!) {
    pullOffShelvesGoods(id: $id, userId: $userId)
  }
`
export const putOnShelvesGoodsMutation = gql`
  mutation($id: String!, $userId: String!) {
    putOnShelvesGoods(id: $id, userId: $userId)
  }
`

export const pullOffShelvesPurchaseMutation = gql`
  mutation($id: String!, $userId: String!) {
    pullOffShelvesPurchase(id: $id, userId: $userId)
  }
`
export const putOnShelvesPurchaseMutation = gql`
  mutation($id: String!, $userId: String!) {
    putOnShelvesPurchase(id: $id, userId: $userId)
  }
`

export const increaseGoodsReadCount = gql`
  mutation($id: String!) {
    increaseGoodsReadCount(id: $id)
  }
`
export const increasePurchaseReadCount = gql`
  mutation($id: String!) {
    increasePurchaseReadCount(id: $id)
  }
`
