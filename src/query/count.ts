import { gql } from 'apollo-boost'

export const getForSaleProductCountQuery = gql`
query getForSaleProductCountQuery {
  getForSaleProductCount {
    result
  }
}`
