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