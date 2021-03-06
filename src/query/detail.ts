import { gql } from 'apollo-boost'

export const DetailFragment = gql`
  fragment DetailFragment on ProductInfo {
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
    agreeExchange
    owner {
      id
      nickname
      avatarUrl
      brief
      certification
    }
    location {
      province {
        id
        name
      }
      city {
        id
        name
      }
    }
  }
`

export const ExchangeInfoFragment = gql`
  fragment ExchangeInfoFragment on ExchangeInfo {
    id
    userId
    targetId
    sourceId
    status
    goods {
      title
      price
      coverUrl
      status
      readCount
    }
    createTime
    updateTime
  }
`

export const goodsDetailQuery = gql`
  query($id: String!) {
    detailInfo: goodsById(id: $id) {
      ...DetailFragment
    }
    receivedExchanges(targetId: $id) {
      ...ExchangeInfoFragment
    }
    requestedExchanges(sourceId: $id) {
      ...ExchangeInfoFragment
    }
  }
  ${DetailFragment}
  ${ExchangeInfoFragment}
`

export const purchaseDetailQuery = gql`
  query($id: String!) {
    detailInfo: purchaseById(id: $id) {
      ...DetailFragment
    }
  }
  ${DetailFragment}
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

export const exchangeableGoodsQuery = gql`
  query {
    exchangeableGoods {
      id
      title
      status
      price
      readCount
      coverUrl
      createTime
    }
  }
`

export const exchangeGoodsMutation = gql`
  mutation($exchangeInput: ExchangeInput) {
    exchangedGoods: exchangeGoods(exchangeInput: $exchangeInput)
  }
`

export const agreeToExchangeMutation = gql`
  mutation($exchangeId: String, $userId: String) {
    agreeToExchange(exchangeId: $exchangeId, userId: $userId)
  }
`

export const rejectToExchangeMutation = gql`
  mutation($exchangeId: String, $userId: String) {
    rejectToExchange(exchangeId: $exchangeId, userId: $userId)
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
export const deleteExchangeMutation = gql`
  mutation($exchangeId: String!) {
    deleteExchange(exchangeId: $exchangeId)
  }
`
export const cancelExchangeAgreementMutation = gql`
  mutation($exchangeId: String!) {
    cancelExchangeAgreement(exchangeId: $exchangeId)
  }
`
