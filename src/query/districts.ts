import { gql } from 'apollo-boost'

export const districtsQuery = gql`
query {
  districts {
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
