import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { Product } from '../../../../interfaces/product'
import ProductListItem from '../productListItem'

interface InProps {
  listData: Product[],
}

function Index(props: InProps) {
  const { listData = []} = props
  return (
    <View>
      {
        listData.map(item => <ProductListItem key={item.id} item={item} />)
      }
    </View>
  )
}

export default memo(Index)
