import { gql } from 'apollo-boost'

export const recommendListQuery = gql`
{
   goods {
     id,
     title,
     price,
     coverUrl,
     categoryName,
     owner {
       nickname,
       avatarUrl,
       certification
     }
   }
}
`
