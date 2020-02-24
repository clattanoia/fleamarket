import { gql } from 'apollo-boost'

export const categoryQuery = gql`
{
  categories {
    id,
    name,
    icon
  }
}
`
